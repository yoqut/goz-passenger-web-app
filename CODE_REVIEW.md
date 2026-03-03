# GOZ Web App - Code Review & Refactoring Plan

## FSD Architecture Violations

### 1. Hook Location Issues
- ❌ `src/shared/hook/useGetUserId.ts`
  - **Problem**: Wrong folder name (`hook` should be plural `hooks`)
  - **Solution**: Move to `src/shared/lib/hooks/use-get-user-id.ts`
  - **Impact**: Low - single file move + import updates

- ❌ `src/pages/home/hooks/`
  - **Problem**: Business logic hooks in pages layer (violates FSD)
  - **Solution**: Move to `src/entities/orders/hooks/` or `src/features/create-order/hooks/`
  - **Files affected**:
    - `useSearchTimer.ts` → `src/entities/orders/hooks/`
    - `useSearchTaxi.ts` → `src/entities/orders/hooks/`
    - `useOrder.ts` → `src/entities/orders/hooks/use-create-order.ts`
  - **Impact**: Medium - multiple imports to update

### 2. API Hooks in Wrong Location
- ⚠️ `src/shared/api/auth-hooks.ts`
- ⚠️ `src/shared/api/client-hooks.ts`
  - **Problem**: Hooks should not be in API folder
  - **Solution**: Review and potentially move to `src/entities/user/api/`
  - **Impact**: Medium

### 3. Type Definitions
- ✅ `src/shared/types/` - Correct location
- ⚠️ Need to check if all types are properly shared vs entity-specific

### 4. Assets Organization
- ✅ `src/app/assets/` - App-level assets correct
- ⚠️ `src/entities/orders/assets/` - Should review if these belong in shared

## Code Quality Issues

### 1. useGetUserId Hook
**Current Issues:**
- Uses `(launchParams as any)` - type safety issue
- No memoization - could cause unnecessary re-renders
- Error handling uses `console.error` but returns null - should potentially use toast

**Improvements:**
```typescript
// Add proper types
// Use useMemo for userData computation
// Better error handling
```

### 2. Order Management
**Files to Review:**
- `src/entities/orders/hooks/useGetUserOrders.ts`
- `src/entities/orders/hooks/useCreateDelivery.ts`
- `src/entities/orders/hooks/useOrderDelete.ts`
- `src/pages/home/ui/home-page.tsx`

**Issues:**
- Duplicate logic in home-page.tsx and orders-page.tsx
- Order state management could be simplified
- Polling logic in useSearchTaxi could be optimized

### 3. Translation Keys
- ✅ All translations added for uz, en, ru
- Consider creating a type-safe translation key system

## Naming Conventions

### Current Issues:
- Mixed conventions: `useGetUserId` vs `use-get-user-id`
- Some files: `tarif-desc.tsx` vs `tariff-card.tsx` (inconsistent spelling)

### Recommendations:
- Files: kebab-case (`use-get-user-id.ts`)
- Components: PascalCase (`UserCard.tsx`)
- Hooks: camelCase export, kebab-case file (`useGetUserId` in `use-get-user-id.ts`)

## Priority Fixes

### High Priority:
1. ✅ Fix useGetUserId location and naming - **COMPLETED**
   - Moved to `src/shared/lib/hooks/use-get-user-id.ts`
   - Added proper TypeScript types and JSDoc
   - Added useMemo for performance
   - Exported from shared/lib/hooks/index.ts
2. ✅ Move page hooks to correct layers - **COMPLETED**
   - Moved useOrder → use-create-order.ts in entities/orders/hooks/
   - Moved useSearchTaxi → use-search-taxi.ts in entities/orders/hooks/
   - Moved useSearchTimer → use-search-timer.ts in entities/orders/hooks/
   - Created index.ts to export all hooks
   - Updated all import statements
   - Deleted old pages/home/hooks/ directory
3. ✅ Fix launchParams 'as any' usage - **COMPLETED**
   - Updated main-layout.tsx to use useGetUserId hook
   - Updated onboarding page to use useGetUserId hook
   - Updated login page to use useGetUserId hook
   - Removed all direct launchParams access with 'as any'

### Medium Priority:
4. Review and optimize polling logic
5. Add proper TypeScript types (remove `any`)
6. Consolidate similar components

### Low Priority:
7. Improve error handling consistency
8. Add JSDoc comments for complex functions
9. Consider adding unit tests for hooks

## Implementation Plan

1. **Phase 1**: File Structure (1-2 hours)
   - Move hooks to correct locations
   - Update all imports
   - Fix naming conventions

2. **Phase 2**: Code Quality (2-3 hours)
   - Remove type assertions (`as any`)
   - Add proper types
   - Optimize hooks with useMemo/useCallback

3. **Phase 3**: Logic Optimization (2-3 hours)
   - Consolidate duplicate logic
   - Improve error handling
   - Optimize re-renders

4. **Phase 4**: Documentation (1 hour)
   - Add JSDoc comments
   - Update README with architecture
   - Create component documentation

## Files Requiring Immediate Attention

1. `src/shared/hook/useGetUserId.ts` - ⚠️ High
2. `src/pages/home/ui/home-page.tsx` - ⚠️ High (too much logic)
3. `src/pages/home/hooks/*` - ⚠️ High (wrong layer)
4. `src/entities/orders/hooks/useGetUserOrders.ts` - Medium
5. `src/shared/lib/utils/helper.ts` - Medium (review functions)

## Metrics

- Total Files Moved: 5 ✅
- Import Statements Updated: ~18 ✅
- Lines of Code Refactored: ~600 ✅
- Actual Time: ~3 hours for Phase 1 completion

## Refactoring Progress

### Phase 1: File Structure ✅ COMPLETED
- ✅ Moved useGetUserId to `src/shared/lib/hooks/use-get-user-id.ts`
- ✅ Moved 3 hooks from pages/home/hooks/ to entities/orders/hooks/
- ✅ Created index.ts exports for all hook directories
- ✅ Updated ~18 import statements across the codebase
- ✅ Fixed naming conventions (kebab-case for files)
- ✅ Deleted old hook directory

### Phase 2: Code Quality ✅ PARTIALLY COMPLETED
- ✅ Removed `as any` from launchParams in 3 files (main-layout, onboarding, login)
- ✅ Added proper TypeScript types to useGetUserId
- ✅ Optimized useGetUserId with useMemo
- ✅ Added JSDoc comments to migrated hooks
- ⚠️ Some `as any` remain in UI components (acceptable technical debt with comments)

### Next Steps:
- Review and consolidate duplicate logic in home-page.tsx and orders-page.tsx
- Consider optimizing polling logic in useSearchTaxi
- Add more comprehensive error handling
