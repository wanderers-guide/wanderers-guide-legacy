// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
// import Nav from "./components/Nav";
import Nav from "./components/SolidNav";

import "./root.css";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Wanderer's Guide - Pathfinder 2e Character Manager</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link rel="shortcut icon" href="/images/favicon.svg" />
        <Link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/favicon.svg"
        />
        <Link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon.svg"
        />
        <Link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon.svg"
        />

        <Meta name="apple-mobile-web-app-title" content="Wanderer's Guide" />
        <Meta name="application-name" content="Wanderer's Guide" />
        <Meta name="theme-color" content="#000000" />
        <Meta name="author" content="Quzzar" />

        <Link rel="manifest" href="/manifest.json" />

        <Link rel="canonical" href="https://wanderersguide.app/" />
        <Link rel="shortcut icon" href="/images/favicon.svg" />
        <Link
          data-n-head="ssr"
          data-hid="apple-touch-icon"
          rel="apple-touch-icon"
          href="/images/favicon.svg"
          sizes="180x180"
        />
        <Link
          rel="icon"
          type="image/png"
          href="/images/favicon.svg"
          sizes="32x32"
        />
        <Link
          rel="icon"
          type="image/png"
          href="/images/favicon.svg"
          sizes="16x16"
        />
        <Link rel="mask-icon" href="/images/favicon.svg" color="#000000" />

        {/* OGP */}
        <Meta property="og:image" content="/images/favicon.svg" />
        <Meta property="og:site_name" content="Wanderer's Guide" />
        <Meta property="og:locale" content="en_US" />
        <Meta property="og:url" content="https://wanderersguide.app/" />
        <Meta property="og:title" content="Wanderer's Guide" />
        <Meta
          property="og:description"
          content="Semi-automated character manager for Pathfinder 2e"
        />
        <Meta property="og:type" content="website" />
        <Meta property="og:image:width" content="600" />
        <Meta property="og:image:height" content="400" />

        {/* Keywords */}
        <Meta
          name="keywords"
          content="wanderer's guide,wanderers guide,wanderers,wanderer's,guide,pathfinder second edition,pathfinder 2e,character manager,character builder,pf2e,pf 2e"
        />
      </Head>
      <Body class="bg-zinc-800 text-white">
        <Suspense>
          <ErrorBoundary>
            {/* <SolidNav /> */}
            <Nav />
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
