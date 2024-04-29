import { setupWorker } from 'msw/browser';
import { addReivew, reviewsById, reviewForMain } from './review';
import { bestBooks } from './books';
import { banners } from './banner';

const hanlders = [reviewsById, addReivew, reviewForMain, bestBooks, banners];

export const worker = setupWorker(...hanlders);

