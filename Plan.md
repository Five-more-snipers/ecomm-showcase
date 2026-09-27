Mock E-Commerce — AI Development Plan
1. Project Goal
Build a fun, realistic, test-friendly mock e-commerce application where a visitor can experience a complete shopping journey from browsing products to receiving an order confirmation.

This is primarily a learning, demonstration, and testing project, not a production commerce platform.

The application should feel like a real e-commerce website while deliberately keeping external integrations such as payment gateways, shipping providers, email providers, etc. simulated.

The project should demonstrate:

Modern React/Next.js frontend development

Client-side state management

Server-state management

Java Spring Boot backend development

REST API design

Oracle database integration

Transactional business logic

Automated testing

End-to-end testing

Clean project structure

Easy local setup

Easy database initialization

Easy configuration

Good developer experience

2. Existing Starting Point
IMPORTANT
A frontend template already exists.

The existing frontend is currently unintegrated.

Do NOT assume that the frontend already communicates with the backend.

Do NOT unnecessarily replace or rewrite the existing frontend template.

The initial task is to:

Understand the existing frontend structure.

Identify the existing pages/components/layouts.

Identify the existing frontend technologies.

Preserve the existing visual design where practical.

Integrate the frontend with the new application architecture.

Add the required state management and API integration around the existing UI.

The existing frontend should be treated as the starting UI/product shell.

Before making major frontend changes, inspect what already exists.

3. Target Architecture
Use a modular monolith architecture.

Do NOT introduce microservices unless there is a compelling reason.

Target architecture:

                         Browser
                            │
                            ▼
                 ┌─────────────────────┐
                 │       Next.js       │
                 │                     │
                 │ React               │
                 │ Zustand             │
                 │ TanStack Query      │
                 │ Existing UI         │
                 └──────────┬──────────┘
                            │
                         REST/JSON
                            │
                            ▼
                 ┌─────────────────────┐
                 │    Spring Boot      │
                 │                     │
                 │ Product             │
                 │ Inventory           │
                 │ Customer            │
                 │ Cart                │
                 │ Order               │
                 │ Payment Simulation  │
                 │ Checkout            │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      Oracle DB      │
                 └─────────────────────┘

4. Technology Stack
Frontend
Use:

Next.js

React

TypeScript

Zustand

TanStack Query

TanStack Table where useful

Existing frontend template

Do not introduce additional frontend state-management libraries unless there is a clear reason.

Backend
Use:

Java

Spring Boot

Spring Web

Spring Validation

Spring Security where authentication is required

Spring Data JPA and/or JDBC

Oracle JDBC driver

OpenAPI/Swagger

Database
Primary database:

Oracle Database

The application should be designed so that database configuration is externalized.

Do not hard-code:

Database hostname

Port

Service name

Username

Password

Schema information

5. Frontend Responsibilities
Next.js should primarily provide the web experience.

Responsibilities include:

Rendering the existing UI

Product browsing

Product search

Product filtering

Product details

Cart UI

Checkout UI

Order confirmation

Order history

Order tracking

Error/loading states

User interaction

Client-side UI state

The frontend should NOT contain core business rules that belong to the backend.

For example:

Bad:

Frontend decides:
"Inventory is available, therefore purchase is allowed."

Better:

Frontend:
"Request checkout"

        ↓

Spring Boot:
"Validate inventory"

        ↓

Spring Boot:
"Create order"

        ↓

Frontend:
"Display result"

The backend is the authority for business operations.

6. Zustand Responsibilities
Use Zustand for client/UI state.

Examples:

Zustand
├── cart UI state
├── checkout UI state
├── selected product options
├── modal state
├── sidebar state
├── demo/tester preferences
└── temporary client-only state

Do not use Zustand as a replacement for TanStack Query.

Avoid storing API data permanently in Zustand when TanStack Query can manage it.

7. TanStack Query Responsibilities
Use TanStack Query for server state.

Examples:

TanStack Query
├── Products
├── Product details
├── Categories
├── Inventory information
├── Orders
├── Order details
├── Customer information
└── Checkout mutations

Example:

GET /api/products
GET /api/products/{id}
GET /api/orders/{id}

POST /api/cart
POST /api/orders
POST /api/checkout

Use query invalidation/refetching appropriately after mutations.

8. Backend Domain Modules
Organize Spring Boot by business domain rather than creating one enormous collection of controllers/services.

Suggested structure:

backend/
└── src/
    └── main/
        └── java/
            └── .../
                ├── product/
                │   ├── controller/
                │   ├── service/
                │   ├── repository/
                │   ├── entity/
                │   └── dto/
                │
                ├── inventory/
                │   ├── controller/
                │   ├── service/
                │   ├── repository/
                │   ├── entity/
                │   └── dto/
                │
                ├── customer/
                ├── cart/
                ├── order/
                ├── checkout/
                ├── payment/
                └── common/

Keep business logic in services/domain components rather than controllers.

9. Core E-Commerce Flow
The most important feature is the complete shopping journey.

A tester should be able to experience:

Open store
    ↓
Browse products
    ↓
Search/filter
    ↓
Open product
    ↓
Choose quantity/options
    ↓
Add to cart
    ↓
View cart
    ↓
Checkout
    ↓
Enter customer information
    ↓
Choose mock payment method
    ↓
Submit order
    ↓
Backend validates transaction
    ↓
Payment simulation
    ↓
Inventory update
    ↓
Order creation
    ↓
Confirmation
    ↓
View order

This flow should be treated as the project's primary happy-path scenario.

10. Mock Payment System
Do NOT integrate a real payment provider.

Create a simulated payment system.

Possible outcomes:

PAYMENT_SUCCESS
PAYMENT_DECLINED
PAYMENT_TIMEOUT

The tester should be able to experience different outcomes.

Example:

Payment Method

○ Mock Credit Card
○ Mock Bank Transfer
○ Mock Cash on Delivery

The backend should own payment simulation.

The frontend should request payment/checkout and display the result.

11. Order Lifecycle
Orders should have an explicit lifecycle.

Example:

PENDING
    ↓
PAYMENT_CONFIRMED
    ↓
PROCESSING
    ↓
SHIPPED
    ↓
DELIVERED

Additional states may include:

PAYMENT_FAILED
CANCELLED
REFUNDED

The exact state machine should be implemented deliberately.

Do not scatter status changes throughout random controllers.

Create a clear service/domain mechanism for order transitions.

12. Order Confirmation
After a successful purchase, the tester should see a meaningful confirmation page.

Example information:

Order Confirmed!

Order #ORD-2026-000123

✓ Payment confirmed
✓ Order created
✓ Inventory reserved

Items:
- Product A x 2
- Product B x 1

Total:
$123.45

[View Order]
[Continue Shopping]

The confirmation should be based on actual backend-created order data rather than fake frontend-only state.

13. Database Model
Initial entities may include:

PRODUCT
CATEGORY
INVENTORY
CUSTOMER
CART
CART_ITEM
ORDERS
ORDER_ITEM
PAYMENT

Potential relationships:

CATEGORY
   │
   └── PRODUCT
          │
          └── INVENTORY


CUSTOMER
   │
   ├── CART
   │     └── CART_ITEM
   │            └── PRODUCT
   │
   └── ORDERS
          │
          └── ORDER_ITEM
                 └── PRODUCT

ORDER
   │
   └── PAYMENT

The schema should prioritize clarity over extreme normalization or enterprise complexity.

14. Transactional Integrity
Checkout is one of the most important backend operations.

The system should prevent obvious inconsistencies such as:

Inventory = 1

Customer A buys 1
Customer B buys 1

Result must NOT be:

Inventory = -1

Checkout should use appropriate database transactions.

A simplified flow:

BEGIN TRANSACTION

Validate customer
Validate cart
Validate products
Validate inventory
Calculate totals
Create order
Create order items
Reserve/decrement inventory
Create payment result

COMMIT

If a critical operation fails:

ROLLBACK

The implementation should make transaction boundaries explicit and testable.

15. API Design
Use REST APIs.

Suggested initial endpoints:

GET    /api/products
GET    /api/products/{id}

GET    /api/categories

GET    /api/inventory/{productId}

POST   /api/cart
GET    /api/cart/{cartId}
PUT    /api/cart/{cartId}/items/{itemId}
DELETE /api/cart/{cartId}/items/{itemId}

POST   /api/checkout

GET    /api/orders
GET    /api/orders/{orderId}

POST   /api/orders/{orderId}/cancel

GET    /api/orders/{orderId}/tracking

Do not implement every endpoint immediately.

Start with the smallest vertical slice that allows:

Product → Cart → Checkout → Order → Confirmation

Then expand.

16. Configuration and Initialization
VERY IMPORTANT
The project should be easy for another developer to initialize.

A person should NOT have to manually edit source code to configure the database.

The desired experience is approximately:

git clone <project>

configure environment

start application

database initializes

seed data is loaded

frontend starts

open browser

start shopping

Configuration should be externalized.

Example:

.env.example

and/or:

application-local.yml

Use environment variables for sensitive configuration.

Example:

DB_HOST=
DB_PORT=
DB_SERVICE_NAME=
DB_USERNAME=
DB_PASSWORD=

API_BASE_URL=

NEXT_PUBLIC_API_URL=

Never commit real passwords.

17. Database Initialization
Database setup should be as automated as practical.

Provide:

database/
├── schema/
├── migrations/
├── seed/
└── README.md

The project should clearly document:

How to create/configure the Oracle database.

Required Oracle version/compatibility.

Required user/schema.

Required permissions.

How schema creation works.

How sample data is loaded.

How to reset the database.

How to migrate between versions.

Prefer a migration tool such as Flyway or Liquibase rather than relying on undocumented manual SQL execution.

The migration process should be reproducible.

18. Seed Data
The project should include realistic sample data.

For example:

Categories
├── Electronics
├── Home
├── Clothing
├── Books
└── Accessories

Products should include:

Name

Description

Price

Category

Image

SKU

Inventory quantity

Active/inactive status

The seed data should make the demo immediately usable.

A freshly initialized system should NOT appear empty.

19. Demo/Test Scenarios
The project should intentionally support multiple scenarios.

Happy path
Browse
→ Add to cart
→ Checkout
→ Payment succeeds
→ Order confirmed

Payment failure
Checkout
→ Payment declined
→ Order not completed
→ Cart remains available

Insufficient inventory
Product has quantity = 1

Tester attempts to purchase quantity = 2

Backend rejects checkout

Order cancellation
Order created
→ Cancel order
→ Order becomes CANCELLED

Order tracking
PENDING
→ PROCESSING
→ SHIPPED
→ DELIVERED

These scenarios are useful for both manual testers and automated tests.

20. Testing Strategy
Testing is an important part of this project.

Backend unit tests
Test:

Product services

Inventory logic

Checkout logic

Payment simulation

Order state transitions

Validation

Backend integration tests
Test:

Spring Boot
    ↓
Oracle/test database

where appropriate.

Frontend tests
Test:

Product rendering

Cart interactions

Checkout interactions

Error states

Loading states

End-to-end tests
Use Playwright or an equivalent browser automation tool.

Important E2E scenario:

Open application
    ↓
Find product
    ↓
Add product to cart
    ↓
Open cart
    ↓
Checkout
    ↓
Complete mock payment
    ↓
Verify confirmation
    ↓
Verify order

The E2E test should exercise the real frontend and backend rather than mocking every API.

21. Local Development Experience
Aim for a simple developer experience.

Ideally:

project/
├── frontend/
├── backend/
├── database/
├── docs/
├── scripts/
├── .env.example
├── docker-compose.yml (if appropriate)
├── Makefile or task runner
└── README.md

Useful commands could eventually be:

./scripts/setup
./scripts/start
./scripts/stop
./scripts/reset-db
./scripts/seed
./scripts/test

Equivalent npm/Maven commands are also acceptable.

The exact mechanism is less important than making the workflow obvious and reproducible.

22. Docker
Docker may be used to simplify local development.

Potential services:

docker compose

├── frontend
├── backend
└── oracle-related development dependency

However, do not assume Oracle can simply be replaced with another database if Oracle-specific behavior is important.

If Oracle licensing/image availability makes local Oracle setup complicated, document the supported alternatives clearly.

The application should remain explicitly Oracle-compatible.

23. Environment Profiles
Support clear environment profiles.

Example:

local
test
demo

Potential configuration:

application.yml
application-local.yml
application-test.yml
application-demo.yml

Do not mix development secrets into committed configuration.

Provide templates such as:

.env.example

24. Observability
The application should provide useful logs.

At minimum, backend logs should make it possible to understand:

request
→ checkout started
→ inventory validation
→ payment simulation
→ order creation
→ checkout completed

Do not log:

Passwords

Sensitive credentials

Secrets

Payment credentials

Use correlation/request IDs if practical.

25. Error Handling
The backend should return consistent error responses.

For example:

{
  "code": "INSUFFICIENT_INVENTORY",
  "message": "Requested quantity is not available.",
  "details": {}
}

The frontend should translate these into useful user-facing experiences.

Avoid exposing Java stack traces to users.

26. API Contract
Keep the frontend/backend contract explicit.

Prefer generating or maintaining OpenAPI documentation.

The API contract should clearly describe:

Request schemas

Response schemas

Error responses

Authentication requirements

HTTP status codes

Avoid letting frontend and backend independently invent incompatible data structures.

27. Security
This is a demo application, but basic security practices should still be followed.

Never:

Commit passwords

Commit API secrets

Put database credentials in frontend code

Trust prices sent by the browser

Trust inventory values sent by the browser

Allow the frontend to determine the final order total

The backend should calculate authoritative values.

For example:

Bad:

Frontend:
POST /checkout

{
  "total": 10.00
}

Better:

Frontend:
POST /checkout

{
  "cartId": "..."
}

Backend:

Load cart
→ Load product prices
→ Calculate total
→ Validate inventory
→ Create order

28. Development Philosophy
Prefer vertical slices over implementing one entire layer at a time.

Do NOT spend a long time building every database table before connecting anything.

Instead:

Slice 1
Product
    ↓
API
    ↓
Frontend

Slice 2
Product
    ↓
Cart
    ↓
Frontend

Slice 3
Cart
    ↓
Checkout
    ↓
Payment simulation
    ↓
Order
    ↓
Confirmation

Slice 4
Order tracking

Slice 5
Automated E2E testing

Each slice should produce something that can actually be run.

29. AI Development Rules
Any AI working on this project should follow these rules.

Before changing code
Inspect the existing project.

Understand:

Current frontend framework

Existing components

Existing routing

Existing styling

Existing dependencies

Existing configuration

Existing API assumptions

Do not blindly replace the existing frontend.

Before adding a dependency
Ask:

Is the dependency necessary?

Does the existing stack already solve this problem?

Does it increase complexity unnecessarily?

Prefer the existing stack.

Before changing architecture
Explain:

Why the change is necessary.

What problem it solves.

What existing code it affects.

Whether it introduces additional operational complexity.

Do not introduce microservices, message brokers, Redis, GraphQL, Kubernetes, or other infrastructure simply because they are popular.

The project should remain fun and approachable.

30. Definition of Done
A feature is not considered complete merely because code exists.

A feature should ideally include:

Code
+
API
+
Database behavior
+
Frontend integration
+
Error handling
+
Tests
+
Documentation

For example, "checkout implemented" means:

Frontend checkout UI
        ↓
TanStack mutation
        ↓
Spring Boot endpoint
        ↓
Validation
        ↓
Inventory transaction
        ↓
Payment simulation
        ↓
Order creation
        ↓
Oracle persistence
        ↓
API response
        ↓
Confirmation UI
        ↓
Automated test

31. Suggested Project Structure
Target structure:

mock-ecommerce/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── stores/
│   ├── queries/
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   └── test/
│   ├── pom.xml
│   └── ...
│
├── database/
│   ├── migrations/
│   ├── seed/
│   └── README.md
│
├── e2e/
│   ├── tests/
│   └── playwright.config.ts
│
├── scripts/
│   ├── setup
│   ├── start
│   ├── stop
│   ├── seed
│   └── reset-db
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   └── development.md
│
├── .env.example
├── docker-compose.yml
├── README.md
└── Plan.md

The exact structure may change after inspecting the existing frontend.

32. Initial Implementation Order
Follow approximately this order.

Phase 1 — Understand the existing frontend
Inspect existing frontend.

Run it.

Document current routes.

Document current components.

Identify existing dependencies.

Identify what can be reused.

Phase 2 — Establish project structure
Create backend.

Establish Spring Boot configuration.

Establish frontend API configuration.

Establish environment configuration.

Establish database configuration.

Phase 3 — Database
Configure Oracle.

Add migration mechanism.

Create initial schema.

Add seed data.

Verify migrations from a clean database.

Phase 4 — Product vertical slice
Implement:

Oracle
→ Spring Boot
→ REST API
→ TanStack Query
→ Existing frontend

The tester should be able to browse real products.

Phase 5 — Cart
Implement:

Product
→ Add to cart
→ Cart

Use Zustand for appropriate client/UI state and backend APIs for authoritative cart/order state.

Phase 6 — Checkout
Implement:

Cart
→ Checkout
→ Inventory validation
→ Mock payment
→ Order creation

Phase 7 — Confirmation
Implement:

Order
→ Confirmation page
→ Order details

Phase 8 — Order lifecycle
Implement:

Processing
→ Shipped
→ Delivered

Phase 9 — Failure scenarios
Implement:

Payment declined
Insufficient inventory
Invalid checkout
Order cancellation

Phase 10 — Testing
Implement:

Unit tests

Integration tests

E2E tests

Phase 11 — Developer experience
Improve:

Setup scripts

Environment configuration

Database initialization

Seed/reset commands

Documentation

Docker where useful

33. Most Important Principle
The project should optimize for:

"Clone → Configure → Initialize → Run → Have fun shopping."

A new developer should be able to understand the system without reading thousands of lines of code.

A tester should be able to open the application and immediately understand what to do.

An AI developer should be able to work on one feature without accidentally breaking unrelated parts of the system.

The architecture should demonstrate good engineering practices without becoming an unnecessarily complicated enterprise system.

34. Final Target Experience
The finished project should feel like a small but realistic e-commerce platform:

                    ┌──────────────┐
                    │    Tester    │
                    └──────┬───────┘
                           │
                           ▼
                    Browse Store
                           │
                           ▼
                     Find Product
                           │
                           ▼
                       Add Cart
                           │
                           ▼
                       Checkout
                           │
                           ▼
                   Mock Payment
                      /       \
                  Success     Failure
                    │            │
                    ▼            ▼
                Create Order   Show Error
                    │
                    ▼
              Order Confirmation
                    │
                    ▼
               Track Order
                    │
                    ▼
                 Delivered

The goal is not to replicate Amazon or build a production payment platform.

The goal is to create a small, polished, technically interesting playground for experiencing and testing a complete e-commerce workflow.