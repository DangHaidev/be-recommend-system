/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// movie.mapper.ts
export function mapTmdbMovieToEntity(tmdbData: any) {
    return {
        tmdbId: tmdbData.id,
        title: tmdbData.title,
        overview: tmdbData.overview,
        releaseDate: tmdbData.release_date,
        posterUrl: `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`,
        backdropUrl: `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}`,
        rating: tmdbData.vote_average,
        genres: tmdbData.genres?.map((g) => g.name) || [],
        runtime: tmdbData.runtime,
        language: tmdbData.original_language,
    };
}
