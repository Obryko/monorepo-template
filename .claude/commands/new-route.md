Create a new TanStack Start file-based route at the given path.

Usage: /new-route <path>
Example: /new-route /dashboard/settings

Steps:
1. Create `apps/web/src/routes/<path>.tsx` with:
   - `createFileRoute` with the exact path
   - A named component function
   - Export as `Route`
2. If the route needs a loader, add `loader` to `createFileRoute` config
3. Run `pnpm --filter @monorepo-template/web typecheck` to regenerate `routeTree.gen.ts`
4. Commit: `feat(web): add <path> route`

Note: `src/routeTree.gen.ts` is auto-generated — never edit it manually. The typecheck step triggers TanStack Router's codegen.
