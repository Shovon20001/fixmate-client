"use client";
import { createAuthClient } from "better-auth/react";

// no baseURL: the auth API lives on the same origin as the site
export const authClient = createAuthClient();
