import { setupWorker } from 'msw/browser';
import { addReivew, reviewsById } from './review';

const hanlders = [reviewsById, addReivew];

export const worker = setupWorker(...hanlders);

