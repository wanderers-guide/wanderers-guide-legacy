import { A } from "solid-start";
import { getAuthSession } from "~/utils/getAuthSession";

export default function Nav() {
  const session = getAuthSession();
  const user = () => session()?.user;

  return (
    <header>
      <div class="container-fluid pl-0">
        <div class="header d-md-flex justify-content-between align-items-center pt-1 pl-1 pr-5">
          <div>
            <a href="/">
              <img
                src="/images/logo.png"
                style="height:50px;"
                alt="Wanderer's Guide"
              />
            </a>
            <sup class="is-inline has-txt-value-number is-size-6-5 font-bebas-neue text-overflow-none is-hidden-mobile">
              Beta 1.9.3
            </sup>
          </div>

          <div>
            <nav>
              <a class="icon is-medium nav-menu-toggle">
                <i class="fa fa-2x fa-bars"></i>
              </a>
              <div id="mobile-nav-menu-container"></div>

              <ul class="nav-menu pt-1">
                <li>
                  <a href="/">Home</a>
                </li>

                <li class="mx-lg-4 mx-md-3 my-md-0 my-2">
                  <a href="/profile/characters" class="active">
                    Characters
                  </a>
                </li>
                <span class="ml-lg-4 ml-md-3"></span>

                <li>
                  <a href="/builds">Builds</a>
                </li>

                <li class="mx-lg-4 mx-md-3 my-md-0 my-2">
                  <a href="/homebrew">Homebrew</a>
                </li>

                <li>
                  <a href="/gm-tools">GM Tools</a>
                </li>

                <li class="mx-lg-4 mx-md-3 my-md-0 my-2">
                  <a href="/browse">
                    <i class="fas fa-lg fa-search"></i>
                  </a>
                </li>

                <li class="mr-4">
                  <a href="#" id="nav-profile-picture">
                    <object
                      class="profile-header-icon"
                      data="{{user.thumbnail}}"
                      type="image/png"
                    >
                      <img
                        class="profile-header-icon"
                        src="/images/fb_profile_pic.png"
                        alt="Profile Image"
                      />
                    </object>
                  </a>
                  <ul>
                    <li>
                      <a href="/profile" class="drop-text">
                        <i class="fas fa-user-circle"></i> Account{" "}
                      </a>
                    </li>

                    {/* <li><a href="/admin/panel" class="drop-text"><i class="fas fa-tools"></i> Admin Panel </a></li> */}

                    <li>
                      <a
                        href="https://discord.gg/kxCpa6G"
                        target="_blank"
                        class="drop-text"
                      >
                        <i class="fab fa-discord"></i> Discord
                        <sup class="icon is-small">
                          <i class="fas fa-xs fa-external-link-alt"></i>
                        </sup>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.patreon.com/wanderersguide"
                        target="_blank"
                        class="drop-text"
                      >
                        <i class="fab fa-patreon"></i> Patreon
                        <sup class="icon is-small">
                          <i class="fas fa-xs fa-external-link-alt"></i>
                        </sup>
                      </a>
                    </li>
                    <li>
                      <a href="/api_docs" class="drop-text">
                        <i class="fas fa-cog"></i> API Docs{" "}
                      </a>
                    </li>
                    <li>
                      <a href="/license" class="drop-text">
                        <i class="fas fa-scroll"></i> License{" "}
                      </a>
                    </li>
                    <li>
                      <a href="/auth/logout" class="drop-text">
                        <i class="fas fa-sign-out-alt"></i> Logout{" "}
                      </a>
                    </li>
                  </ul>
                </li>

                {/* <li class="mr-4"><a href="/auth/login">Login <i class="fas fa-sign-in-alt"></i></a></li> */}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
