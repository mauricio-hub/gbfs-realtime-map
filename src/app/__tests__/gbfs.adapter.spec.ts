import { adaptGbfsFeed } from '../core/adapters/gbfs.adapter';

const makeResponse = (bikes: unknown[]) => ({
    last_updated: 0,
    ttl: 30,
    data: { bikes: bikes as never[] },
});

describe('adaptGbfsFeed', () => {
    it('should return empty array when bikes array is empty', () => {
        const result = adaptGbfsFeed(makeResponse([]));
        console.log('result....',result)
        expect(result).toEqual([]);
    });


    it('should mark vehicle as reserved', () => {
        const result = adaptGbfsFeed(
            makeResponse([{ bike_id: 'v2', lat: 40.7, lon: -73.9, is_reserved: true, is_disabled: false }]),
        );
        expect(result[0].status).toBe('reserved');
    });

    it('should mark vehicle as disabled', () => {
    const result = adaptGbfsFeed(
      makeResponse([{ bike_id: 'v3', lat: 40.7, lon: -73.9, is_reserved: false, is_disabled: true }]),
    );
    expect(result[0].status).toBe('disabled');
  });


   it('should mark vehicle as available', () => {
    const result = adaptGbfsFeed(
      makeResponse([{ bike_id: 'v3', lat: 40.7, lon: -73.9, is_reserved: false, is_disabled: false }]),
    );
    expect(result[0].status).toBe('available');
  });
});