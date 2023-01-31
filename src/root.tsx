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
  Stylesheet,
  Title,
} from "solid-start";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import BulmaAssets from "./components/static/BulmaAssets";

// Uncomment when ready to use tailwind
// import "./root.css";

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

        <BulmaAssets />

        {/* Bootstrap-Core */}
        <Stylesheet
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
          integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N"
          crossorigin="anonymous"
        />
        <Stylesheet href="/css/bootstrap-4-utilities.min.css" />

        {/* Font-Awesome-Icons */}
        <script
          defer
          src="https://pro.fontawesome.com/releases/v5.12.1/js/all.js"
        ></script>

        {/* General Styles */}
        <Stylesheet
          href="/css/core/site-themes-dark.css"
          type="text/css"
          media="all"
        />
        {/* 
        <Stylesheet
          href="/css/core/site-themes-light.css"
          type="text/css"
          media="all"
        /> */}
        <Stylesheet
          href="/css/core/system-styles.css"
          type="text/css"
          media="all"
        />
        <Stylesheet href="/css/pageloader.css" type="text/css" media="all" />
        <Stylesheet href="/css/chosen/chosen.css" type="text/css" media="all" />
        <Stylesheet
          href="/css/core/bulma-extension.css"
          type="text/css"
          media="all"
        />
        <Stylesheet href="/css/core/fonts.css" type="text/css" media="all" />
        <Stylesheet href="/css/core/modals.css" type="text/css" media="all" />
        <Stylesheet
          href="/css/core/quickviews.css"
          type="text/css"
          media="all"
        />

        {/* General Utils */}
        <script type="text/javascript" src="/js/general-utils.js"></script>
        <script type="text/javascript" src="/js/cache-storing.js"></script>
        <script
          type="text/javascript"
          src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/9.3.0/math.js"
        ></script>

        {/* Loading Bars/Spinners  */}
        <Link rel="stylesheet" href="/css/loading-bar.css" />
        <script src="/js/loading_bar/loadingHandler.js"></script>
        <script src="/js/loading_bar/loading-bar.js"></script>

        {/* Quill JS  */}
        <Link
          href="https://cdn.quilljs.com/1.3.6/quill.snow.css"
          rel="stylesheet"
        />
        <Link href="/css/quill.css" rel="stylesheet" />
        <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>

        {/* Web-Fonts */}
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="anonymous"
        />
        <Link
          href="https://fonts.googleapis.com/css?family=Nunito+Sans:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&amp;subset=latin-ext,vietnamese"
          rel="stylesheet"
        />
        <Link
          href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i&amp;subset=cyrillic,cyrillic-ext,greek,greek-ext,latin-ext,vietnamese"
          rel="stylesheet"
        />
        <Link
          href="https://fonts.googleapis.com/css?family=Noto+Sans&display=swap"
          rel="stylesheet"
        />
        <Link
          href="https://fonts.googleapis.com/css?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
        <Link
          href="https://fonts.googleapis.com/css2?family=Nanum+Gothic+Coding&display=swap"
          rel="stylesheet"
        />
        <Link
          href="https://fonts.googleapis.com/css2?family=Proza+Libre&display=swap"
          rel="stylesheet"
        />
        <Link
          href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap"
          rel="stylesheet"
        />

        {/* Socket IO */}
        <script src="/socket.io/socket.io.js"></script>

        {/* jQuery */}
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
        <script src="/js/jQuery/jquery.ui.touch-punch.min.js"></script>
        <script src="/js/jQuery/chosen.jquery.min.js"></script>

        {/* Mobile View Message  */}
        <script type="text/javascript" src="/js/mobile-view.js"></script>

        {/* Misc Scripts  */}
        <script type="text/javascript" src="/js/back-to-top.js"></script>
        <script type="text/javascript" src="/js/show-more.js"></script>

        <script
          type="text/javascript"
          src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js"
          onload={() => console.log("script:loaded")}
        />
        <script
          type="text/javascript"
          src="https://unpkg.com/downloadjs@1.4.7"
        />
        <script
          type="text/javascript"
          src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.0/html2pdf.bundle.min.js"
        />

        <script type="text/javascript" src="/js/character-list.js" />

        <script type="text/javascript" src="/js/require-signin.js" />

        <script
          type="text/javascript"
          src="/js/char_export/export-handler.js"
        />
        <script type="text/javascript" src="/js/char_export/populate-pdf.js" />
        <script type="application/pdf" src="/pdf/character_sheet.pdf"></script>
      </Head>
      <Body class="bg-zinc-800">
        <Suspense>
          <ErrorBoundary>
            <div id="main-container">
              <div id="main-top">
                <Nav />
                <div class="banner_w3lspvt-2"></div>
              </div>
              <div class="top-border"></div>
              <div id="center-body">
                <Routes>
                  <FileRoutes />
                </Routes>
              </div>

              <Footer />
            </div>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
