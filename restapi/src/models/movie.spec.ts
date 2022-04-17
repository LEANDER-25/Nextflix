import { Movie } from './movie.schema';

describe('Movie', () => {
  it('should be defined', () => {
    expect(new Movie()).toBeDefined();
  });
});
