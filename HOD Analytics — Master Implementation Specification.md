# HOD Analytics — Master Implementation Specification

## ROLE

You are a senior full-stack engineer working inside the existing House of Décor (HOD) Next.js production codebase.

Your task is to design and implement the HOD Business Analytics system described in this document.

This is NOT a greenfield project.

The existing HOD architecture is the source of truth for implementation.

Do not introduce a new frontend architecture.
Do not restructure the existing codebase.
Do not replace existing authentication.
Do not replace existing WooCommerce integration.
Do not replace existing cart/checkout/payment systems.
Do not duplicate Vercel Analytics unnecessarily.
Do not duplicate WooCommerce Analytics unnecessarily.

==================================================
1. PRIMARY BUSINESS OBJECTIVE
==================================================

Build an internal HOD Business Analytics dashboard that helps the HOD team answer:

1. How much are we selling?
2. Which products are performing?
3. Which products get attention but do not convert?
4. Where are customers dropping in the purchase funnel?
5. Which acquisition sources produce revenue?
6. Which colors, variants and sizes perform best?
7. What are customers doing on the website?
8. Does the Room Visualizer generate measurable commercial value?
9. Where are cart, checkout, payment and visualizer failures occurring?

The objective is NOT to create another generic analytics dashboard.

The objective is to create an HOD Business Intelligence layer that connects:

USER BEHAVIOR
+
WOOCOMMERCE COMMERCE DATA
+
SELECTED VERCEL ANALYTICS DATA
=
BUSINESS INSIGHTS

==================================================
2. EXISTING HOD ARCHITECTURE
==================================================

Known HOD conventions:

- Next.js 16.x
- App Router
- React 19.x
- TypeScript
- Tailwind CSS v4
- CSS custom properties/design tokens
- Zustand v5
- WooCommerce backend
- Existing Next.js → WooCommerce integration

Known structure:

src/
├── app/
├── components/
│   └── {feature-name}/
├── lib/
│   ├── data/
│   ├── hooks/
│   ├── product/
│   ├── store/
│   └── utils/

Existing conventions:

- Zustand stores → src/lib/store/
- Hooks → src/lib/hooks/
- WooCommerce/API functionality → existing src/lib/product/ and related API utilities
- Feature components → src/components/{feature-name}/
- Routes → src/app/{route-name}/
- Path alias → @/* resolves from project root
- Dynamic imports → next/dynamic with ssr:false where appropriate
- Existing animations/UI patterns → reuse existing HOD conventions

IMPORTANT:

Do NOT assume these conventions are exhaustive.

Inspect the actual repository first and follow its current patterns.

==================================================
3. FIRST PHASE — READ-ONLY CODEBASE AUDIT
==================================================

Before writing implementation code, inspect:

1. Existing authentication
2. Existing RBAC implementation
3. Existing requireAnalyticsAccess()
4. Existing getCurrentWpUser()
5. Existing WooCommerce API utilities
6. Existing Vercel Analytics/Speed Insights integration
7. Existing admin routes
8. Existing admin UI if present
9. Existing Product type
10. Existing cart store
11. Existing checkout flow
12. Existing Room Visualizer
13. Existing environment-variable conventions
14. Existing database/storage infrastructure
15. Existing analytics/event tracking, if any

Do not create a duplicate implementation if one already exists.

Produce a concise architecture summary before implementation.

==================================================
4. FINAL DATA-SOURCE RESPONSIBILITY
==================================================

There are THREE data sources.

------------------------------------------
A. VERCEL
------------------------------------------

Vercel is the source for technical/web analytics.

Use Vercel for metrics such as:

- Website traffic
- Visitors
- Page views
- Referrers
- Geography
- Device/browser information
- Web performance
- Core Web Vitals
- Speed Insights
- Vercel-specific analytics

DO NOT rebuild the full Vercel Analytics dashboard.

HOD should provide:

[ Open Vercel Analytics ↗ ]

[ Open Vercel Speed Insights ↗ ]

These links are mandatory.

------------------------------------------
B. WOOCOMMERCE
------------------------------------------

WooCommerce is the source of truth for commerce and transactions.

Use the EXISTING HOD WooCommerce integration.

WooCommerce data may include:

- Orders
- Revenue
- Products
- Variations
- Categories
- Customers
- Refunds
- Discounts
- Coupons
- Inventory
- Units sold
- Product sales

Do NOT create a second order system.

Do NOT make the analytics database the source of truth for orders.

------------------------------------------
C. HOD CUSTOM ANALYTICS
------------------------------------------

HOD must build the behavioral layer.

This includes:

- Product views
- Product interaction
- Variant selection
- Size selection
- Add to cart
- Cart behavior
- Checkout behavior
- Search
- Filters
- Marketing attribution
- Room Visualizer behavior
- Application-specific errors
- Session-level behavioral flow

==================================================
5. FINAL SOURCE-OF-TRUTH MODEL
==================================================

Mandatory architecture rule:

Vercel
→ source for technical/web analytics

WooCommerce
→ source for transactional/commercial truth

HOD Analytics
→ source for first-party user behavior and cross-system business analysis

HOD Analytics Query Layer
→ combines the above sources into business metrics

Do not move transactional truth into HOD Analytics.

Do not rebuild Vercel's infrastructure dashboard.

==================================================
6. RBAC / AUTHORIZATION — ALREADY VERIFIED
==================================================

HOD already has server-side user authentication.

Existing authentication flow:

Next.js
→ getCurrentWpUser()
→ /wp-json/hod/v1/me
→ authenticated user ID

The existing /me endpoint does NOT expose the user's role.

However:

WooCommerce
→ /wp-json/wc/v3/customers/{userId}

returns the customer record including:

role

Verified role behavior:

administrator
→ Analytics access allowed

customer
→ Analytics access denied

The existing HOD RBAC implementation already provides:

requireAnalyticsAccess()

and:

requireAnalyticsAccessServer()

with a 60-second server-side role cache.

DO NOT recreate this authorization mechanism.

REUSE the existing implementation.

DO NOT modify WordPress/PHP.

DO NOT introduce JWT just for analytics.

DO NOT create a new authentication system.

==================================================
7. ANALYTICS SECURITY MODEL
==================================================

Analytics access must be protected at the server level.

Protected page:

/admin/analytics

Protected API namespace:

/api/analytics/*

Authorization flow:

Incoming request
→ requireAnalyticsAccess()
→ getCurrentWpUser()
→ authenticated user ID
→ WooCommerce customer lookup
→ customer.role
→ administrator?
    YES → allow
    NO  → 403

Unauthenticated:

→ 401 / redirect to login

Authenticated non-admin:

→ 403 Forbidden

IMPORTANT:

Never rely on:

- localStorage
- Zustand client state
- client-side isAdmin
- hidden UI buttons
- URL parameters
- client-side redirects

The server must make the authorization decision.

Every analytics API route must independently enforce authorization.

==================================================
8. ADMIN ANALYTICS PAGE
==================================================

Use the existing RBAC architecture.

The analytics page must be server-protected before analytics content is exposed.

Do not implement the admin page like a normal client-only authenticated account page.

The page should:

- verify analytics access server-side
- redirect unauthenticated users appropriately
- show a 403/access-denied state to authenticated non-admin users
- render the analytics dashboard only for authorized administrators

Reuse the existing requireAnalyticsAccessServer() implementation.

==================================================
9. ANALYTICS API SECURITY
==================================================

Every analytics Route Handler must perform:

requireAnalyticsAccess(request)

before:

- querying analytics data
- querying WooCommerce
- querying Vercel
- returning analytics information

At minimum, protect:

/api/analytics/revenue
/api/analytics/products
/api/analytics/funnel
/api/analytics/visualizer

Any future analytics endpoint must follow the same protection pattern.

Do not create one public analytics API and rely on the dashboard to hide data.

==================================================
10. CREDENTIAL SECURITY
==================================================

All sensitive credentials remain server-side.

Never expose:

- WooCommerce consumer secret
- WooCommerce consumer key if not required client-side
- Vercel API token
- Analytics database credentials

Do NOT use NEXT_PUBLIC_ for secrets.

Browser:

→ HOD Analytics API

Server:

→ WooCommerce
→ Vercel
→ Analytics database

==================================================
11. OVERALL SYSTEM ARCHITECTURE
==================================================

Final logical architecture:

HOD Next.js Frontend
    ↓
Existing Analytics RBAC
    ↓
Analytics API / Server Layer
    ↓
 ┌──────────────┬──────────────┬────────────────┐
 │              │              │
 │              │              │
WooCommerce   Vercel       HOD Events
   API         API         Analytics DB
 │              │              │
 └──────────────┴──────────────┘
               ↓
      Analytics Query Layer
               ↓
      HOD Admin Dashboard

Vercel full dashboard:
→ accessible through external links

==================================================
12. VERCEL INTEGRATION
==================================================

The HOD dashboard must include external Vercel links:

[ Open Vercel Analytics ↗ ]
[ Open Vercel Speed Insights ↗ ]

Additionally:

Evaluate whether selected Vercel metrics should be embedded inside the
HOD dashboard using the currently supported Vercel API.

IMPORTANT:

Do NOT assume current Vercel API endpoints, request formats, or
authentication methods.

Before implementing Vercel API integration:

1. Inspect the current project configuration.
2. Verify current official Vercel API documentation.
3. Determine whether the required data is available through the current
   Vercel API.
4. Determine required server-side authentication.
5. Determine rate limits/caching requirements.
6. Only then implement.

If Vercel API integration cannot be safely or reliably implemented,
DO NOT block the rest of the analytics system.

Keep the external Vercel links.

Never expose Vercel credentials to the browser.

==================================================
13. HOD ANALYTICS EVENT SYSTEM
==================================================

Build one centralized analytics tracking abstraction.

Do NOT scatter raw fetch() calls across components.

Conceptually:

trackEvent(eventName, payload)

The actual implementation MUST follow the existing HOD architecture.

The tracking API must be lightweight and non-blocking.

If analytics tracking fails:

THE STOREFRONT MUST CONTINUE WORKING.

Analytics must never block:

- product rendering
- add to cart
- checkout
- payment
- visualizer
- navigation

==================================================
14. SESSION TRACKING
==================================================

Create/reuse a stable anonymous session identifier.

The session should connect events such as:

product_viewed
→ add_to_cart
→ checkout_started
→ purchase_completed

If authenticated customer identity can safely be associated through the
existing HOD architecture, support user_id.

Do not expose unnecessary personal information.

Do not use sensitive information as a session identifier.

==================================================
15. CORE EVENT CATALOG
==================================================

Implement these events first.

PRODUCT:

product_viewed
product_variant_selected
product_size_selected
product_image_interacted

CART:

add_to_cart
cart_viewed
cart_item_removed
cart_quantity_changed

CHECKOUT:

checkout_started
payment_method_selected
payment_started
payment_failed
purchase_completed

DISCOVERY:

search_performed
search_result_clicked
search_no_results
category_selected
filter_applied
sort_changed
product_card_clicked

PRODUCT INFORMATION:

size_guide_opened
shipping_info_opened
contact_clicked

ROOM VISUALIZER:

visualizer_opened
visualizer_product_loaded
visualizer_room_selected
visualizer_room_uploaded
visualizer_tool_used
visualizer_perspective_adjusted
visualizer_exported
visualizer_add_to_cart
visualizer_closed

ERRORS:

product_load_failed
add_to_cart_failed
checkout_failed
payment_failed
visualizer_load_failed
visualizer_export_failed
image_load_failed

==================================================
16. EVENT SCHEMA
==================================================

Use a centralized event schema.

Conceptually:

AnalyticsEvent {
    event
    timestamp
    sessionId
    userId?
    productId?
    variationId?
    page?
    properties?
}

Properties may contain event-specific safe values.

Do NOT store:

- passwords
- card data
- CVV
- authentication tokens
- payment secrets
- unnecessary PII

Do not duplicate the full WooCommerce product object inside every event.

Use IDs and relevant properties.

==================================================
17. EVENT DEDUPLICATION
==================================================

Be careful with:

- React Strict Mode
- component remounting
- route changes
- retries
- repeated clicks

Do not emit duplicate product_viewed events simply because a component
renders twice.

Critical events such as purchase_completed must support reliable
deduplication using a stable transaction/order identifier where
appropriate.

==================================================
18. PURCHASE ATTRIBUTION
==================================================

The system should connect:

session
→ frontend behavior
→ add to cart
→ checkout
→ WooCommerce order

WooCommerce order ID is the transactional identifier.

Do not invent a second order identifier.

This relationship is required for:

- product conversion
- funnel analysis
- visualizer-assisted revenue
- marketing attribution

==================================================
19. ANALYTICS DATABASE
==================================================

FIRST inspect whether HOD already has:

- PostgreSQL
- Supabase
- analytics database
- backend datastore

If a suitable datastore already exists:

REUSE IT.

Do not introduce another database unnecessarily.

If no suitable datastore exists:

Evaluate a PostgreSQL-compatible analytics store such as Supabase/Postgres,
but follow existing HOD infrastructure decisions.

Initial tables:

analytics_events
analytics_sessions

Do NOT create every possible aggregate table immediately.

Add aggregate tables later only when actual query performance requires them.

==================================================
20. ANALYTICS_EVENTS
==================================================

Initial structure:

analytics_events

id
event_name
timestamp
session_id
user_id nullable
product_id nullable
variation_id nullable
page
properties JSONB

Recommended indexes:

event_name
timestamp
session_id
product_id
variation_id

Adapt SQL types and naming to the actual database.

==================================================
21. ANALYTICS_SESSIONS
==================================================

Initial structure:

analytics_sessions

id
session_id
user_id nullable
started_at
last_seen_at

Use this table to support session-based funnel calculations.

==================================================
22. API ARCHITECTURE
==================================================

Separate:

EVENT INGESTION

from:

ANALYTICS QUERY APIs

Conceptual structure:

Client
→ Analytics Tracking Service
→ Analytics ingestion API
→ Analytics database

Admin dashboard
→ protected analytics API
→ query layer
→ analytics DB + WooCommerce + optional Vercel API

Follow existing HOD Next.js Route Handler conventions.

Do not invent a different API architecture.

==================================================
23. ANALYTICS QUERY LAYER
==================================================

Do not put complex SQL/business calculations directly inside UI components.

Create a reusable server-side query/calculation layer according to
existing HOD conventions.

Responsibilities:

- revenue aggregation
- order aggregation
- product aggregation
- funnel calculations
- customer calculations
- attribution calculations
- visualizer calculations
- comparison/date-range logic

UI should consume normalized analytics responses.

==================================================
24. CORE DASHBOARD
==================================================

Create:

/admin/analytics

with:

Overview
Sales
Products
Customers
Behavior
Marketing
Room Visualizer
Errors
External Analytics

Use existing HOD authentication/RBAC.

Use HOD design tokens and existing UI patterns.

Do not create an unrelated visual design language.

==================================================
25. OVERVIEW DASHBOARD
==================================================

First screen should contain:

KPI cards:

- Net Revenue
- Orders
- Average Order Value
- Conversion Rate

Charts:

- Revenue over time
- Orders over time

Tables:

- Top products
- Top products by revenue
- Top products by orders

Funnel:

Product View
→ Add to Cart
→ Cart
→ Checkout
→ Payment
→ Purchase

Room Visualizer summary:

- Usage
- Add to Cart
- Purchase
- Revenue

External:

[ Open Vercel Analytics ]
[ Open Speed Insights ]

==================================================
26. DATE FILTERS
==================================================

Support:

- Today
- Yesterday
- Last 7 days
- Last 30 days
- This month
- Previous month
- Custom range

Where reliable, support:

Compare previous period

Do not implement year-over-year comparisons unless enough historical
data exists.

Every metric must clearly use the selected date range.

==================================================
27. METRIC DEFINITIONS
==================================================

Metrics must have explicit definitions.

Examples:

Conversion Rate
=
defined successful purchases / defined sessions

Add-to-Cart Rate
=
sessions with add_to_cart / sessions with product_viewed

Checkout Rate
=
checkout_started sessions / cart sessions

Purchase Rate
=
purchase sessions / checkout sessions

Never silently mix:

- page views
- users
- sessions
- orders

Label the metric unit clearly.

==================================================
28. REVENUE ANALYTICS
==================================================

WooCommerce is the source of truth.

Calculate/display:

- Gross Sales
- Net Sales
- Orders
- Items Sold
- Average Order Value
- Refund Amount
- Refund Rate
- Discount Amount
- Revenue over time
- Revenue by category
- Revenue by product
- Revenue by variation

Reuse existing WooCommerce/HOD definitions where available.

Document the exact definition of Net Revenue.

Do not invent a new revenue definition.

==================================================
29. PRODUCT ANALYTICS
==================================================

For each product:

- Views
- Add-to-cart count
- Add-to-cart rate
- Orders
- Units sold
- Revenue
- Conversion
- Refunds
- Stock
- Visualizer opens
- Visualizer add-to-cart
- Visualizer conversion

Surface two useful opportunity views:

HIGH INTEREST / LOW CONVERSION

LOW TRAFFIC / HIGH CONVERSION

These are insights, not automatic claims about the reason.

==================================================
30. VARIANT / SIZE ANALYTICS
==================================================

Capture and calculate:

productId
variationId
color
size

Metrics:

- Most viewed color
- Most selected color
- Most selected size
- Most purchased size
- Most purchased color
- Variant ATC rate
- Variant conversion
- Variant revenue
- Variant stock status

==================================================
31. CART ANALYTICS
==================================================

Track:

add_to_cart
cart_viewed
cart_item_removed
cart_quantity_changed

Calculate:

- Cart sessions
- Items added
- Items removed
- Average cart value
- Average items/cart
- Cart abandonment

Define the abandonment window/session logic before calculating it.

Do not label a session abandoned simply because the user left the cart
page without a defined boundary.

==================================================
32. CHECKOUT ANALYTICS
==================================================

Track:

checkout_started
payment_method_selected
payment_started
payment_failed
purchase_completed

Calculate:

- Checkout start rate
- Checkout completion rate
- Checkout abandonment
- Payment failure rate
- Payment method usage

Instrument the EXISTING HOD checkout/payment flow.

Do not create a second checkout tracking layer.

==================================================
33. CUSTOMER ANALYTICS
==================================================

Use WooCommerce customer/order data where appropriate.

Calculate:

- New customers
- Returning customers
- Repeat purchase rate
- Orders/customer
- Customer revenue
- Average customer value
- Time between purchases
- Geography

Initial segments:

- New Customer
- Returning Customer
- High Value Customer
- One-Time Customer
- Inactive Customer

Do not build a CRM.

==================================================
34. MARKETING ATTRIBUTION
==================================================

Capture where available:

utm_source
utm_medium
utm_campaign
utm_content
utm_term
referrer
landing_page

Associate attribution with the session.

When a purchase occurs, connect the order to the appropriate attribution.

Calculate:

- Sessions by source
- Product views by source
- Add-to-cart by source
- Checkout by source
- Orders by source
- Revenue by source
- Conversion by source
- AOV by source

Use a clearly documented attribution model.

Start with a practical session/first-touch model rather than claiming
perfect multi-touch attribution.

==================================================
35. SEARCH ANALYTICS
==================================================

If the existing HOD website has search:

Track:

search_performed
search_result_clicked
search_no_results

Calculate:

- Top searches
- Search usage
- No-result searches
- Search → product view
- Search → cart
- Search → purchase

==================================================
36. FILTER / DISCOVERY ANALYTICS
==================================================

If applicable:

filter_applied
sort_changed
category_selected
product_card_clicked

Capture filter type/value.

Calculate:

- Most-used filters
- Zero-result filters
- Filter → product view
- Filter → cart
- Filter → purchase

Do not track every UI click.

==================================================
37. ROOM VISUALIZER ANALYTICS
==================================================

The Room Visualizer is already integrated into HOD.

DO NOT refactor it.

Only instrument meaningful events.

Existing visualizer functionality should remain unchanged.

Track:

visualizer_opened
visualizer_product_loaded
visualizer_room_selected
visualizer_room_uploaded
visualizer_tool_used
visualizer_perspective_adjusted
visualizer_exported
visualizer_add_to_cart
visualizer_closed

For tool usage, capture actual tools present in the current visualizer.

Do not assume tool names without inspecting the current implementation.

==================================================
38. VISUALIZER BUSINESS METRICS
==================================================

Calculate:

- Visualizer usage rate
- Visualizer room selection rate
- Custom room upload rate
- Visualizer export rate
- Visualizer add-to-cart rate
- Visualizer purchase rate
- Visualizer-assisted revenue
- Most visualized products
- Most used visualizer tools

Compare:

VISUALIZER USERS

vs.

NON-VISUALIZER USERS

Compare:

- Add-to-cart rate
- Purchase rate
- Revenue
- AOV

IMPORTANT:

Do not claim that the visualizer caused a conversion increase unless a
controlled experiment is implemented.

Use:

"Users who used the visualizer had X% conversion"

not:

"The visualizer increased conversion by X%."

==================================================
39. ERROR ANALYTICS
==================================================

Track:

product_load_failed
add_to_cart_failed
checkout_failed
payment_failed
visualizer_load_failed
visualizer_export_failed
image_load_failed

Capture safe metadata:

- event
- page
- productId when appropriate
- variationId when appropriate
- error type/code
- timestamp

Do not capture:

- payment information
- passwords
- auth tokens
- sensitive private customer data

==================================================
40. PERFORMANCE / VERCEL
==================================================

Do not build a clone of Vercel Speed Insights.

Technical performance remains primarily in Vercel.

HOD may display selected business-relevant performance indicators only if
there is a reliable reason to do so.

Potential custom events:

- visualizer_load_time
- visualizer_initialization_time
- export_duration

Only add these if they are genuinely useful.

==================================================
41. DASHBOARD UI
==================================================

Follow existing HOD design system.

Reuse existing:

- typography
- colors
- spacing
- cards
- tables
- buttons
- date controls
- modal patterns
- existing chart library if available

Do not add a charting dependency without first checking whether one
already exists.

Dashboard must have:

- loading states
- empty states
- error states
- responsive behavior
- sensible data formatting

==================================================
42. API RESPONSE DESIGN
==================================================

Analytics APIs should return normalized, predictable structures.

Do not return raw WooCommerce/Vercel payloads directly to UI.

Example conceptual response:

{
  data: ...,
  meta: {
    from,
    to,
    comparedFrom,
    comparedTo
  }
}

Adapt to project conventions.

==================================================
43. CACHING
==================================================

Use appropriate server-side caching for expensive analytics queries.

Do not cache personalized authorization decisions incorrectly.

RBAC role cache already exists with a short TTL.

Respect the existing cache strategy for WooCommerce and HOD APIs.

For dashboards:

- short-lived caching is acceptable for aggregate analytics
- real-time order confirmation should still come from WooCommerce
  where required

Do not introduce stale data without clearly defining it.

==================================================
44. PERFORMANCE REQUIREMENTS
==================================================

Analytics must not slow the storefront.

Event tracking:

- asynchronous
- lightweight
- non-blocking

Analytics dashboard:

- aggregate queries
- server-side calculations
- pagination for large tables
- date filtering
- caching when appropriate

Do not fetch thousands of raw events into the browser.

==================================================
45. IMPLEMENTATION ORDER
==================================================

PHASE 1
Inspect existing HOD architecture.

PHASE 2
Inspect existing RBAC implementation.

PHASE 3
Inspect existing WooCommerce API utilities.

PHASE 4
Inspect existing database/storage capabilities.

PHASE 5
Design final event/session schema.

PHASE 6
Build analytics event tracking abstraction.

PHASE 7
Build analytics event ingestion/storage.

PHASE 8
Instrument P0 storefront events.

PHASE 9
Build WooCommerce analytics service.

PHASE 10
Verify/implement optional Vercel API integration.

PHASE 11
Build protected analytics query layer.

PHASE 12
Build Overview dashboard.

PHASE 13
Build Product analytics.

PHASE 14
Build Funnel analytics.

PHASE 15
Instrument Room Visualizer.

PHASE 16
Build Visualizer analytics.

PHASE 17
Build P1 analytics:

- customer
- marketing
- search
- filters
- errors
- inventory signals

PHASE 18
Security / performance / QA.

==================================================
46. IMPORTANT DEVELOPMENT RULE
==================================================

Do NOT build everything in one uncontrolled pass.

After Phase 1:
→ report architecture.

After Phase 5:
→ report the event/database schema.

After Phase 8:
→ verify that events are firing correctly.

After Phase 12:
→ verify the dashboard using real/known WooCommerce data.

After Phase 16:
→ verify Room Visualizer analytics.

Then continue to P1.

Keep every change isolated and reversible.

==================================================
47. FILE / ARCHITECTURE RULE
==================================================

Do not prescribe a new directory architecture.

Inspect the existing project and place files according to existing HOD
patterns.

Likely areas may include:

src/app/
src/components/
src/lib/
src/lib/hooks/
src/lib/store/
src/lib/product/
src/lib/utils/

But verify actual current structure before creating anything.

Do not create:

- a new authentication system
- a new WooCommerce client
- duplicate cart state
- duplicate checkout logic
- a duplicate visualizer
- an unrelated analytics framework

==================================================
48. DO NOT MODIFY UNRELATED FEATURES
==================================================

Unless absolutely required:

DO NOT MODIFY:

- product rendering
- cart logic
- checkout logic
- payment flow
- WooCommerce authentication
- Room Visualizer rendering
- SEO
- unrelated routes
- global CSS
- existing UI architecture

Analytics instrumentation must be additive.

==================================================
49. FINAL ANALYTICS MODULES
==================================================

The final dashboard should conceptually contain:

/admin/analytics

Overview
Sales
Products
Customers
Behavior
Marketing
Room Visualizer
Errors
External Analytics

External Analytics:

[ Open Vercel Analytics ]
[ Open Speed Insights ]

==================================================
50. TOP 15 BUSINESS METRICS
==================================================

If implementation time becomes constrained, these are the priority metrics:

1. Net Revenue
2. Orders
3. Average Order Value
4. Conversion Rate
5. Product View → Add-to-Cart Rate
6. Cart → Checkout Rate
7. Checkout → Purchase Rate
8. Cart Abandonment Rate
9. Top Products by Revenue
10. Top Products by Conversion
11. Revenue by Acquisition Source
12. New vs Returning Customer Revenue
13. Room Visualizer Usage Rate
14. Room Visualizer → Add-to-Cart Rate
15. Room Visualizer-assisted Revenue

==================================================
51. SECURITY ACCEPTANCE CRITERIA
==================================================

Verify:

Administrator:
→ /admin/analytics → allowed

Administrator:
→ /api/analytics/revenue → allowed

Customer:
→ /admin/analytics → 403/access denied

Customer:
→ /api/analytics/revenue → 403

Logged out:
→ /admin/analytics → login

Logged out:
→ /api/analytics/revenue → 401

Directly calling API endpoints manually must NOT bypass RBAC.

==================================================
52. DATA INTEGRITY ACCEPTANCE CRITERIA
==================================================

Verify:

- Revenue matches WooCommerce
- Orders match WooCommerce
- Product sales match WooCommerce
- No duplicate purchase events
- Funnel denominators are documented
- Date filters work
- Attribution is labeled correctly
- Visualizer events are connected to the correct product/session
- Visualizer-assisted revenue uses real WooCommerce orders

==================================================
53. EXISTING HOD COMPATIBILITY
==================================================

Existing HOD authentication and RBAC are already implemented.

Reuse:

requireAnalyticsAccess()
requireAnalyticsAccessServer()
getCurrentWpUser()

Do not rebuild them.

The existing RBAC architecture determines administrator access by:

1. resolving the authenticated WP user
2. reading user.id
3. retrieving the WooCommerce customer server-side
4. reading customer.role
5. allowing role === "administrator"

No WordPress/PHP changes are required for this analytics implementation.

==================================================
54. FINAL SUCCESS CRITERIA
==================================================

The project is complete when:

ARCHITECTURE
✓ Existing HOD architecture preserved
✓ Existing authentication reused
✓ Existing RBAC reused
✓ Existing WooCommerce integration reused
✓ No unnecessary dependencies
✓ No unrelated refactors

SECURITY
✓ Analytics page server-protected
✓ Every analytics API protected
✓ Normal users receive 403
✓ Logged-out users receive 401/login
✓ Vercel credentials server-only
✓ WooCommerce credentials server-only
✓ Analytics DB server-only

DATA
✓ Event system works
✓ Session tracking works
✓ Events are deduplicated
✓ WooCommerce remains transactional truth
✓ Vercel remains technical analytics source
✓ HOD analytics stores behavioral events
✓ Purchase attribution works

DASHBOARD
✓ Overview dashboard
✓ Revenue
✓ Orders
✓ AOV
✓ Conversion
✓ Funnel
✓ Product analytics
✓ Date filters
✓ Top products
✓ Room Visualizer analytics
✓ External Vercel links

QUALITY
✓ Existing storefront unaffected
✓ Cart unaffected
✓ Checkout unaffected
✓ Payment unaffected
✓ Room Visualizer unaffected
✓ Mobile responsive
✓ Loading/empty/error states
✓ npx tsc --noEmit passes
✓ npm run build passes

==================================================
55. FINAL PRINCIPLE
==================================================

Build HOD Analytics as a BUSINESS INTELLIGENCE layer.

Do not build:

"another Vercel dashboard"

Do not build:

"another WooCommerce dashboard"

Build:

USER BEHAVIOR
+
WOOCOMMERCE COMMERCE
+
SELECTED VERCEL DATA
+
ROOM VISUALIZER DATA
+
MARKETING ATTRIBUTION
=
HOD BUSINESS INSIGHTS

The system should allow the HOD team to understand not only:

"What happened?"

but also:

"What did users do before it happened?"

and:

"Which user behaviors are associated with revenue?"

That is the primary value of the system.