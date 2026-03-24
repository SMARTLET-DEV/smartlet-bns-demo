import { filtersToApiQuery, parseCompleteUrl, PropertyFilters } from '@/lib/urlService';

describe('urlService', () => {
    describe('parseCompleteUrl', () => {
        it('should set default takeImage to 5 for listing pages', () => {
            const pathname = '/residential/apartments-for-rent';
            const searchParams = new URLSearchParams();
            const filters = parseCompleteUrl(pathname, searchParams);
            expect(filters.takeImage).toBe(5);
        });

        it('should set default takeImage to 5 for listed pages', () => {
            const pathname = '/listed/residential';
            const searchParams = new URLSearchParams();
            const filters = parseCompleteUrl(pathname, searchParams);
            expect(filters.takeImage).toBe(5);
        });

        it('should allow overriding takeImage via filters if implemented (currently defaults hardcoded in parseCompleteUrl)', () => {
            // Note: parseCompleteUrl currently hardcodes takeImage: 5 in the return object 
            // and doesn't parse it from query params. This test confirms the default behavior.
            const pathname = '/residential/apartments-for-rent';
            const searchParams = new URLSearchParams();
            searchParams.set('takeImage', '10'); // This is ignored by parseUrlToFilters/parseCompleteUrl currently as per code
            const filters = parseCompleteUrl(pathname, searchParams);
            expect(filters.takeImage).toBe(5);
        });
    });

    describe('filtersToApiQuery', () => {
        it('should append takeImage to query string when present in filters', () => {
            const filters: PropertyFilters = {
                takeImage: 5,
                page: 1,
                take: 10
            };
            const query = filtersToApiQuery(filters);
            expect(query).toContain('takeImage=5');
        });

        it('should append takeImage with custom value', () => {
            const filters: PropertyFilters = {
                takeImage: 10,
                page: 1,
                take: 10
            };
            const query = filtersToApiQuery(filters);
            expect(query).toContain('takeImage=10');
        });

        it('should not append takeImage if undefined or 0', () => {
            const filters: PropertyFilters = {
                page: 1,
                take: 10
            };
            const query = filtersToApiQuery(filters);
            expect(query).not.toContain('takeImage=');
        });

        it('should correctly format content filter for listing pages', () => {
            const filters: PropertyFilters = {
                createdAtGt: '2023-01-01', // Signals listing page
                takeImage: 5
            };
            const query = filtersToApiQuery(filters);
            expect(query).toContain('filter%5Bcontent%5D%5Beq%5D=true'); // content=true
        });
    });
});
