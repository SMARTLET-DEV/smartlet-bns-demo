# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

smartLET is a Next.js 15 property rental platform built with React 19, TypeScript, and Tailwind CSS. The application allows users to search, view, and rent properties, while property owners can list and manage their properties.

## Development Commands

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Architecture Overview

### State Management (Redux Toolkit)

The application uses Redux Toolkit with RTK Query for state management and API calls:

- **Store**: Located in `src/redux/store.ts` with `redux-persist` for auth and smartView state
- **Base API**: `src/redux/api/baseAPi.ts` uses a custom middleware that:
  - Encrypts outgoing request bodies using JWT (except specific routes/methods)
  - Decodes JWT-wrapped responses from the backend
  - Automatically includes Bearer token from auth state
- **API Slices**: Each feature has dedicated API files in `src/redux/reducers/*/[feature]Api.ts`
  - Examples: `propertyApi.ts`, `authApi.ts`, `appointmentsApi.ts`, `favoritesApi.ts`
- **State Slices**: Local state managed in `[feature]Slice.ts` files
- **Tag-based Cache Invalidation**: Uses RTK Query tags (`AppointmentBooking`, `Profile`, `Blog`, `RentalApplication`, `RentedProperty`, `Favorites`)

### App Structure (Next.js App Router)

- **Route Groups**:
  - `(dashboard)` - Protected routes for user dashboard features (appointments, favorites, profile, property-list, rented-property)
  - `(rent)` - Property rental routes (commercial, residential)
  - Public routes at root level (properties, blogs, contact, smartview, smartmove, home-inspection, etc.)
- **Custom Layouts**:
  - `src/app/customLayouts/beforeLogLayout.tsx` - For unauthenticated views
  - `src/app/customLayouts/afterLogLayout.tsx` - For authenticated views
  - Dashboard has separate layout: `src/app/(dashboard)/layout.tsx`
- **Providers**: Redux Provider with PersistGate configured in `src/app/providers.tsx`
- **Wrappers**:
  - `ClientWrapper` - Main client-side wrapper
  - `layoutWrapper.tsx` and `appWrapper.tsx` - Layout orchestration

### UI Components

- **shadcn/ui**: Configured with "new-york" style, using Lucide icons
- **Base Components**: Located in `src/components/ui/` (button, dialog, form, input, etc.)
- **Feature Components**: Organized by domain in `src/components/[feature]/`
  - `dashboard/` - Dashboard-specific components including multi-step property listing form
  - `properties/` - Property display, filtering, and application components
  - `auth/` - Authentication modals and forms
  - `mapbox/` - Map integration components

### Multi-Step Property Form

The property listing form (`src/components/dashboard/property-list/AddProperty-steps/`) uses `@stepperize/react`:
- **Steps**: first-step (basic info), second-step (details), third-step (features/floorplan), fourth-step (media)
- **Modals**: `PropertyDetailsOverviewModal`, `review-submit-Modal`
- **Validation**: Zod schemas in `src/lib/validations/addAPropertySchema.ts`

### Styling

- **Tailwind CSS v4**: Uses new `@import "tailwindcss"` syntax in `src/app/globals.css`
- **Custom Theme Variables**: Brand color (`--color-brand-color: #e8566f`), grey variants, card shadows
- **Animations**: `tw-animate-css` package installed
- **Fonts**: Inter and Mulish from Google Fonts

### API Integration

- **Base URL**: Configured via `NEXT_PUBLIC_API_BASE_URL` environment variable
- **JWT Encryption**: All POST/PUT requests (except specific routes) have bodies encrypted with `NEXT_PUBLIC_API_JWT_SECRET`
  - **Exempt routes**: `/rental-applications`, `/properties`, `/profiles`, `/auth/check`
  - Response decryption handled automatically by base API middleware
- **Credentials**: API calls include credentials (`credentials: "include"`)
- **Image Hosting**: AWS S3 bucket (`smartlet-docs-dev.s3.ap-southeast-2.amazonaws.com`) configured in Next.js image config

### Custom Hooks

Located in `src/hooks/`:
- `useIsMobile.ts`, `useIsMobileUserAgent.ts` - Device detection
- `useScreenWidth.ts`, `useScreenHeight.ts` - Responsive layout
- `useScrollPast.ts`, `useIsScrolling.ts` - Scroll tracking
- `useSessionCheck.ts` - Auth session validation
- `useTabReloadListener.ts` - Cross-tab synchronization
- `useHasHydrated.ts` - SSR/hydration state

### Utilities

Located in `src/utils/`:
- `property.ts` - Property data transformations
- `floorUtils.ts` - Floor plan helper functions
- `submitMediaFiles.ts` - File upload handling
- `handleLogoutClient.ts` - Client-side logout logic
- `camelToReadable.ts` - Text formatting utilities
- `downloadUtils.ts` - File download utilities

Located in `src/lib/`:
- `urlService.ts` - URL and query string management (includes `filtersToApiQuery` for property filtering)
- `metadataService.ts` - SEO metadata generation
- `debounce.ts` - Debounce utility

## Key Patterns

### Adding New API Endpoints

1. Create or update the API file in `src/redux/reducers/[feature]/[feature]Api.ts`
2. Inject endpoints using `baseApi.injectEndpoints()`
3. Define TypeScript interfaces for request/response
4. Add appropriate RTK Query tags for cache invalidation
5. Export hooks are auto-generated (e.g., `useGetPropertiesQuery`, `useBookAppointmentMutation`)

### Working with Forms

- Use `react-hook-form` with `@hookform/resolvers` for Zod validation
- Form schemas in `src/lib/validations/`
- shadcn/ui form components provide accessible form primitives

### Authentication Flow

**Provider Hierarchy** (from root layout):
```
RootLayout → Providers (Redux + PersistGate) → ClientWrapper → AppWrapper → LayoutWrapper
  ├─ BeforeLogLayout (unauthenticated)
  └─ AfterLogLayout (authenticated)
```

**Session Management**:
1. Login/signup handled by `src/redux/reducers/auth/authApi.ts`
2. Token stored in Redux (`auth.token`) and persisted via `redux-persist`
3. `useSessionCheck` hook validates session on mount by calling `/auth/check` endpoint
4. `layoutWrapper.tsx` routes to appropriate layout based on auth state
5. Dashboard routes (`(dashboard)/layout.tsx`) include role-based protection (RENTER vs OWNER)
6. `handleLogoutClient` utility clears auth state and redirects
7. Cross-tab synchronization via `useTabReloadListener` ensures consistent auth state

### Property Features

The application includes three main service features:
- **smartVIEW** - Property viewing/visualization (state persisted in Redux)
- **smartMOVE** - Moving services integration
- **Home Inspection** - Property inspection scheduling

**Property Filtering**: Uses `getFilteredProperties` endpoint with support for:
- Pagination, sorting, property type, bedrooms, price range, search queries
- Geo-location queries: `getGeoListBySearch`, `getGeoListByCity` for map markers
- Filter transformation via `filtersToApiQuery` from `src/lib/urlService.ts`

## Environment Variables

Required in `.env`:
- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL
- `NEXT_PUBLIC_API_JWT_SECRET` - JWT secret for request encryption

## Key Dependencies

**Core Stack**:
- Next.js 15.3.1 with App Router
- React 19.0.0
- Redux Toolkit 2.7.0 + RTK Query
- TypeScript 5

**UI/Styling**:
- Tailwind CSS v4
- shadcn/ui (Radix UI primitives)
- Lucide React icons
- Framer Motion, GSAP (animations)

**Forms/Validation**:
- react-hook-form 7.56.1
- Zod 3.24.3
- @hookform/resolvers 5.0.1

**Maps/Media**:
- mapbox-gl 3.11.1
- embla-carousel-react 8.6.0
- lottie-react 2.4.1

**Other**:
- axios 1.9.0
- jsonwebtoken, jwt-decode
- date-fns 3.6.0
- redux-persist 6.0.0
- @stepperize/react (multi-step forms)

## Notes

- The codebase uses strict TypeScript (`strict: true` in tsconfig.json)
- Path alias `@/*` maps to `src/*`
- ESLint configured with Next.js rules plus custom rules for indentation and spacing
- Git main branch is `main`
