export default function Footer() {
  return (
    <>
      <div class="font_preload" style="opacity: 0">
        <span class="pf-icon"></span>
      </div>

      <footer id="wanderers-guide-footer">
        <div class="cpy-right text-center py-3">
          <p class="text-center is-size-7">
            Wanderer's Guide
            <sup class="icon is-small">
              <i class="fas fa-xs fa-trademark"></i>
            </sup>
            <span class="has-txt-faded"> | </span>
            <a href="/license" target="_blank">
              Licenses and Policies
            </a>
            <span class="has-txt-faded"> | </span>
            <a
              class="has-tooltip-top"
              data-tooltip="wanderersguide2e@gmail.com"
            >
              <sub class="icon is-small">
                <i class="far fa-lg fa-envelope"></i>
              </sub>
            </a>
            <span class="has-txt-faded"> | </span>
            <a href="https://discord.gg/kxCpa6G" target="_blank">
              <sub class="icon is-small">
                <i class="fab fa-lg fa-discord"></i>
              </sub>
            </a>
            <span class="has-txt-faded"> | </span>
            <a href="https://www.patreon.com/wanderersguide" target="_blank">
              <sub class="icon is-small">
                <i class="fab fa-lg fa-patreon"></i>
              </sub>
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
