import { Link, Stylesheet } from "solid-start";

export default function BulmaAssets() {
  return (
    <>
      <Stylesheet href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css" />
      <Link rel="stylesheet" href="/css/bulma/bulma-steps.min.css" />
      <script type="text/javascript" src="/js/bulma/bulma-steps.min.js" />

      <Link rel="stylesheet" href="/css/bulma/bulma-tooltip.min.css" />

      <Link rel="stylesheet" href="/css/bulma/bulma-accordion.min.css" />
      <script type="text/javascript" src="/js/bulma/bulma-accordion.min.js" />

      <Link rel="stylesheet" href="/css/bulma/bulma-divider.min.css" />

      <Link rel="stylesheet" href="/css/bulma/bulma-quickview.min.css" />
      <script type="text/javascript" src="/js/bulma/bulma-quickview.min.js" />

      <Link rel="stylesheet" href="/css/bulma/bulma-checkradio.min.css" />
      <Link rel="stylesheet" href="/css/bulma/bulma-badge.min.css" />
      <Link rel="stylesheet" href="/css/bulma/bulma-switch.min.css" />
      <Link rel="stylesheet" href="/css/bulma/bulma-radio-checkbox.min.css" />

      <Link rel="stylesheet" href="/css/bulma/bulma-tagsinput.min.css" />
      <script type="text/javascript" src="/js/bulma/bulma-tagsinput.min.js" />
    </>
  );
}
