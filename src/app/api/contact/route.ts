import { NextResponse } from 'next/server';
import { API_CONFIG } from "@/src/lib/api/api";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body: Record<string, any> = {};
    let uploadedFiles: File[] = [];

    // Parse either multipart/form-data (when files are present) or standard JSON
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        location: formData.get("location"),
        projectType: formData.get("projectType"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      };
      uploadedFiles = formData.getAll("files") as File[];
    } else {
      body = await request.json();
    }

    // Explicitly extract ONLY valid UI fields from the Studio Request Form
    const {
      fullName,
      email,
      phone,
      location,
      projectType,
      subject,
      message,
    } = body;

    // Build a sanitized payload stripping out any redundant or unsupported fields
    const cleanPayload: Record<string, string> = {};

    if (fullName !== undefined && fullName !== null && fullName !== "") cleanPayload.fullName = String(fullName).trim();
    if (email !== undefined && email !== null && email !== "") cleanPayload.email = String(email).trim();
    if (phone !== undefined && phone !== null && phone !== "") cleanPayload.phone = String(phone).trim();
    if (location !== undefined && location !== null && location !== "") cleanPayload.location = String(location).trim();
    if (projectType !== undefined && projectType !== null && projectType !== "") cleanPayload.projectType = String(projectType).trim();
    if (subject !== undefined && subject !== null && subject !== "") cleanPayload.subject = String(subject).trim();
    if (message !== undefined && message !== null && message !== "") cleanPayload.message = String(message).trim();

    // ── SECURITY & VALIDATION AUDIT FOR FILE UPLOADS ──
    const validFiles: File[] = [];
    if (uploadedFiles && uploadedFiles.length > 0) {
      if (uploadedFiles.length > 5) {
        return NextResponse.json(
          { success: false, message: "Security Check Failed: Maximum upload limit is 5 files per request." },
          { status: 400 }
        );
      }

      const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      const maxFileSizeBytes = 25 * 1024 * 1024; // 25MB

      for (const file of uploadedFiles) {
        if (!(file instanceof File) || file.size === 0) continue;

        // Security check 1: Max file size validation
        if (file.size > maxFileSizeBytes) {
          return NextResponse.json(
            { success: false, message: `File "${file.name}" exceeds the maximum limit of 25MB.` },
            { status: 400 }
          );
        }

        // Security check 2: Strict MIME type and file extension allowlist
        const extensionMatch = file.name.match(/\.([a-z0-9]+)$/i);
        const ext = extensionMatch ? extensionMatch[1].toLowerCase() : "";
        const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];

        if (!allowedExtensions.includes(ext) || (!allowedMimeTypes.includes(file.type) && file.type !== "")) {
          return NextResponse.json(
            { success: false, message: `Security violation: "${file.name}" is not a permitted file type. Only PDF, JPG, and PNG are accepted.` },
            { status: 400 }
          );
        }

        validFiles.push(file);
      }
    }

    const wpUrl = API_CONFIG.baseUrl || "https://store.houseofdecor.ae";
    const targetUrl = `${wpUrl}/wp-json/hod/v1/contact?consumer_key=${API_CONFIG.consumerKey}&consumer_secret=${API_CONFIG.consumerSecret}`;

    // Create Basic Auth header to match standard Postman API authorization
    const authHeader = `Basic ${Buffer.from(`${API_CONFIG.consumerKey || ""}:${API_CONFIG.consumerSecret || ""}`).toString('base64')}`;

    // Determine forwarding strategy (FormData if files present, otherwise JSON)
    let fetchBody: any;
    const fetchHeaders: Record<string, string> = {
      'Authorization': authHeader,
    };

    if (validFiles.length > 0) {
      const wpFormData = new FormData();
      Object.entries(cleanPayload).forEach(([key, val]) => wpFormData.append(key, val));
      validFiles.forEach((file) => wpFormData.append('files[]', file, file.name));
      fetchBody = wpFormData;
      // Note: Do NOT set Content-Type header when sending FormData; fetch sets multipart boundary automatically!
    } else {
      fetchHeaders['Content-Type'] = 'application/json';
      fetchBody = JSON.stringify(cleanPayload);
    }

    // Forward to WordPress backend securely with complete credentials and verified data
    const wpResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: fetchHeaders,
      body: fetchBody,
    });

    const textResponse = await wpResponse.text();
    let data: any = {};
    try {
      if (textResponse) {
        data = JSON.parse(textResponse);
      }
    } catch (e) {
      return NextResponse.json(
        { success: false, message: "Invalid response from contact server." },
        { status: wpResponse.status >= 400 ? wpResponse.status : 502 }
      );
    }

    if (!wpResponse.ok) {
      return NextResponse.json(
        { success: false, message: data.message || data.error || 'Failed to submit contact form' },
        { status: wpResponse.status }
      );
    }

    return NextResponse.json({ success: true, message: data.message || 'Submitted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to submit contact form' }, { status: 500 });
  }
}


