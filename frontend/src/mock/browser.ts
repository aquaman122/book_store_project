import { setupWorker } from 'msw/browser';
import { addReivew, reviewsById, reviewForMain } from './review';

const hanlders = [reviewsById, addReivew, reviewForMain];

export const worker = setupWorker(...hanlders);

