# Feature Specification: DB Schema

**Feature Branch**: `[001-db-schema]`  
**Created**: 2026-03-22  
**Status**: Draft  
**Input**: User description: "Create a concise schema specification for a money tracking application"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Account With Minimal Required Data (Priority: P1)

As a new user, I can create my account with only name and email, and complete optional profile details later.

**Why this priority**: Account creation is the entry point for all money tracking features.

**Independent Test**: Can be fully tested by creating a user with only name and email, then updating profile fields in a later request.

**Acceptance Scenarios**:

1. **Given** a new account request with valid name and email, **When** the account is created, **Then** a user record is persisted without requiring profile fields.
2. **Given** an existing user with empty optional profile fields, **When** profile updates are submitted, **Then** optional profile fields are updated without changing required user identity fields.

---

### User Story 2 - Track Personal Expenses (Priority: P2)

As an authenticated user, I can create categorized personal transactions and view my own financial data.

**Why this priority**: Personal expense tracking is a core product outcome.

**Independent Test**: Can be tested by creating categories and personal transactions for one user and verifying isolation from another user.

**Acceptance Scenarios**:

1. **Given** an authenticated user and a valid category, **When** a personal transaction is created, **Then** the transaction is linked to that user and category.
2. **Given** two authenticated users, **When** each user queries transactions, **Then** each user receives only their own records unless explicitly shared through group membership.

---

### User Story 3 - Split Group Expenses And Generate Reports (Priority: P3)

As a group participant, I can track shared transactions, split amounts among members, and access both generated and saved report outputs.

**Why this priority**: Group splitting and reporting support collaborative spending visibility and settlement workflows.

**Independent Test**: Can be tested by creating a group, adding members, recording a shared transaction, storing a report snapshot, and generating an equivalent derived report from the same data.

**Acceptance Scenarios**:

1. **Given** a group with multiple members, **When** a group transaction is recorded, **Then** it is associated to the group and attributed to participant members.
2. **Given** a selected report scope and date range, **When** the report is requested, **Then** the system can return a derived summary and optionally persist the same result as a report snapshot.

### Edge Cases

- Attempted user creation with duplicate email is rejected.
- Group membership cannot be duplicated for the same user and group.
- Transaction amount cannot be zero for expense records.
- Group transactions without a valid group context are rejected.
- Report snapshots must preserve original values even if underlying transactions change later.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST define these models: Users, Profile, Transactions, Categories, Groups, GroupMembers, Reports.
- **FR-002**: Every model MUST use UUID primary keys (UUID v7 preferred) for unique identifiers.
- **FR-003**: System MUST allow user creation with mandatory fields `name` and `email` only.
- **FR-004**: System MUST enforce unique email per user.
- **FR-005**: System MUST support one optional Profile per User with fields `firstName`, `lastName`, `profilePic`, `location`, and `address`, all nullable and updatable after user creation.
- **FR-006**: System MUST support user-owned Categories for transaction classification.
- **FR-007**: System MUST support Transactions for both personal and group expenses.
- **FR-008**: Each Transaction MUST belong to exactly one owner User and exactly one Category.
- **FR-009**: A Transaction MUST optionally reference one Group; when Group is null the transaction is personal, and when Group is set the transaction is a group expense.
- **FR-010**: System MUST support Groups owned by a creator User.
- **FR-011**: System MUST support GroupMembers as the membership join entity between Users and Groups.
- **FR-012**: System MUST enforce unique membership per (`groupId`, `userId`) in GroupMembers.
- **FR-013**: System MUST support Reports in hybrid mode: generated from Transactions on demand and optionally persisted as snapshot records.
- **FR-014**: A persisted Report MUST belong to exactly one owner User and MAY reference one Group for group-scoped reporting.
- **FR-015**: System MUST maintain user-scoped data access boundaries across all entities.

### Key Entities *(include if feature involves data)*

- **Users**: `id`, `name`, `email`, `createdAt`, `updatedAt`; relations: one-to-one Profile, one-to-many Transactions, one-to-many Categories, one-to-many owned Groups, one-to-many GroupMembers, one-to-many Reports.
- **Profile**: `id`, `userId`, `firstName`, `lastName`, `profilePic`, `location`, `address`, `createdAt`, `updatedAt`; relation: belongs to one User (unique `userId`).
- **Transactions**: `id`, `ownerUserId`, `categoryId`, `groupId` (nullable), `amount`, `currency`, `note`, `transactionDate`, `createdAt`, `updatedAt`; relations: belongs to one User, one Category, optional one Group.
- **Categories**: `id`, `ownerUserId`, `name`, `type`, `createdAt`, `updatedAt`; relation: belongs to one User, has many Transactions; unique (`ownerUserId`, `name`).
- **Groups**: `id`, `ownerUserId`, `name`, `description`, `createdAt`, `updatedAt`; relations: belongs to one owner User, has many GroupMembers, has many Transactions, has many Reports.
- **GroupMembers**: `id`, `groupId`, `userId`, `role`, `joinedAt`; relations: belongs to one Group and one User; unique (`groupId`, `userId`).
- **Reports**: `id`, `ownerUserId`, `groupId` (nullable), `reportType`, `rangeStart`, `rangeEnd`, `snapshotData`, `generatedAt`, `createdAt`; relations: belongs to one User, optional one Group; supports persisted snapshot while remaining derivable from source transactions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of new users can be created using only name and email with no additional required fields.
- **SC-002**: 100% of profile updates can be completed after account creation without blocking transaction usage.
- **SC-003**: Users can create and retrieve personal expense records with category assignment in under 1 minute for a standard flow.
- **SC-004**: Group expense records can be associated to valid group members with zero duplicate memberships accepted.
- **SC-005**: For the same date range and scope, persisted and derived report totals match exactly.

## Assumptions

- Monetary precision uses fixed decimal values appropriate for financial amounts.
- Reports store aggregated snapshot output rather than duplicating all transaction rows.
- Group splits support equal and custom distributions in downstream implementation using group membership and transaction context.
