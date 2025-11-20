import { scoreVenueAgainstRequirements, findBestMatches } from '../../venues/service';
import * as repository from '../../venues/repository';

jest.mock('../../venues/repository');

const mockVenue = {
  id: 'v_1',
  name: 'Skyline Rooftop',
  address: '123 Rooftop Ave, NYC',
  city: 'NYC',
  lat: null,
  lng: null,
  bookingType: 'deeplink',
  bookingProvider: 'opentable',
  bookingUrl: 'https://example.com/book',
  phone: null,
  website: 'https://example.com',
  rating: 4.8,
  priceLevel: '$$$',
  dressCodeSummary: 'Smart casual',
  groupFriendly: true,
  createdAt: new Date(),
  updatedAt: new Date(),
} as const;

describe('scoreVenueAgainstRequirements', () => {
  it('rewards group friendly + tag matches', () => {
    const { score } = scoreVenueAgainstRequirements(mockVenue, {
      groupFriendly: true,
      tags: ['rooftop'],
    });

    expect(score).toBeGreaterThanOrEqual(3);
  });

  it('penalizes mismatched price levels', () => {
    const { score } = scoreVenueAgainstRequirements(mockVenue, {
      priceLevel: '$',
    });

    expect(score).toBeLessThan(0);
  });

  it('penalizes when group friendliness is required but missing', () => {
    const venue = { ...mockVenue, groupFriendly: false };
    const { score } = scoreVenueAgainstRequirements(venue, {
      groupFriendly: true,
    });

    expect(score).toBeLessThan(0);
  });

  it('rewards dress code and area matches', () => {
    const { score } = scoreVenueAgainstRequirements(mockVenue, {
      dressCode: 'smart',
      area: 'Rooftop Ave',
    });

    expect(score).toBeGreaterThanOrEqual(2);
  });

  it('ignores dress code requirement when venue lacks summary', () => {
    const venue = { ...mockVenue, dressCodeSummary: null };
    const { score } = scoreVenueAgainstRequirements(venue, {
      dressCode: 'smart',
    });

    expect(score).toBe(0);
  });

  it('handles missing requirements gracefully', () => {
    const { score } = scoreVenueAgainstRequirements(mockVenue);
    expect(score).toBe(0);
  });
});

describe('findBestMatches', () => {
  const mockedFind = repository.findVenuesByCity as jest.MockedFunction<typeof repository.findVenuesByCity>;
  const baseVenue = {
    ...mockVenue,
  };

  beforeEach(() => {
    mockedFind.mockReset();
  });

  it('selects a primary venue when matches exist', async () => {
    mockedFind.mockResolvedValue([
      baseVenue,
      {
        ...baseVenue,
        id: 'v_2',
        name: 'Arcade Zone',
        address: '456 Fun St, NYC',
        priceLevel: '$$',
        groupFriendly: true,
        dressCodeSummary: 'Casual',
      },
    ]);

    const result = await findBestMatches(
      'NYC',
      { tags: ['rooftop'], groupFriendly: true },
      [{ tags: ['arcade'] }],
    );

    expect(result.primary?.id).toBe('v_1');
    expect(result.backups[0]?.id).toBe('v_2');
  });

  it('returns empty matches when no venues exist', async () => {
    mockedFind.mockResolvedValue([]);

    const result = await findBestMatches('NYC');
    expect(result.primary).toBeNull();
    expect(result.backups).toHaveLength(0);
  });

  it('fills backup target when requirements are absent', async () => {
    mockedFind.mockResolvedValue([
      baseVenue,
      { ...baseVenue, id: 'v_3', name: 'House of Yes' },
      { ...baseVenue, id: 'v_4', name: 'Brooklyn Bowl' },
    ]);

    const result = await findBestMatches('NYC', undefined, undefined, 2);
    expect(result.backups.length).toBeGreaterThanOrEqual(1);
  });

  it('returns null primary when scores are negative', async () => {
    mockedFind.mockResolvedValue([
      { ...baseVenue, id: 'v_5', priceLevel: '$$$' },
    ]);

    const result = await findBestMatches('NYC', { priceLevel: '$', groupFriendly: false });
    expect(result.primary).toBeNull();
  });
});
