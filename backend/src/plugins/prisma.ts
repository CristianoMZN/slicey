import { Elysia } from 'elysia';
import { prisma } from '../config/prisma';

export const prismaPlugin = (app: Elysia) => app.decorate('prisma', prisma);