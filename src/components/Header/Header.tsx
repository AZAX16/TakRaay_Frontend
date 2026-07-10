import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { MoonStar, PanelsTopLeft } from "lucide-react";
import { Button, ToggleSwitch } from "../ui-kit/Button";
import { SearchInput } from "../ui-kit/Input";

import {
  fetchHeaderBoards,
  fetchHeaderProfile,
  searchProjects,
  type BoardSearchResult,
  type CardSearchResult,
  type HeaderBoardResponse,
  type HeaderProfile,
  type ProjectSearchResponse,
} from "../../services/headerApi";
import MyProfile from "../profile/MyProfile";
import logoUrl from "../../assets/white1.webp";
import defaultProfile from "../../assets/default-profile-picture.jpeg";
import "./Header.css";

const defaultBoardLabel = "بردها";
const compactSearchQuery = "(max-width: 980px)";
const headerSearchDelayMs = 220;
const nightModeStorageKey = "takraay-night-mode";

function getStoredNightMode(): boolean {
  try {
    return window.sessionStorage.getItem(nightModeStorageKey) === "true";
  } catch {
    return false;
  }
}

function storeNightMode(isNightMode: boolean): void {
  try {
    window.sessionStorage.setItem(nightModeStorageKey, String(isNightMode));
  } catch {
    // Keep the toggle usable when browser storage is unavailable.
  }
}

function getBoardTitle(board: HeaderBoardResponse): string {
  if (typeof board === "string") return board;
  return board.name || board.title || String(board.id || "");
}

function getBoardId(board: HeaderBoardResponse): string {
  if (typeof board === "string") return "";
  return board.id ? String(board.id) : "";
}

function getBoardKey(board: HeaderBoardResponse, index: number): string {
  if (typeof board === "string") return `${board}-${index}`;
  return board.id ? String(board.id) : `${getBoardTitle(board)}-${index}`;
}

function getBoardIdFromPath(pathname: string): string {
  const match = pathname.match(/^\/boards\/([^/]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

function createEmptySearchResults(query = ""): ProjectSearchResponse {
  return { query, boards: [], cards: [] };
}

function getSearchResultBoardPathId(result: BoardSearchResult | CardSearchResult): string {
  const id = result.project_id ?? result.board_id ?? result.id;
  return id != null ? String(id) : "";
}

function getSearchBoardTitle(result: BoardSearchResult): string {
  return result.board_title || result.project_name || (result.id != null ? String(result.id) : "");
}

function getSearchCardTitle(result: CardSearchResult): string {
  return result.title || result.match_excerpt || (result.id != null ? String(result.id) : "");
}

function ChevronDownIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 9.5L12 15.5L18 9.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="58" height="44" viewBox="0 0 58 44" aria-hidden="true">
      <path
        d="M10 9H48M10 22H48M10 35H48"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="7"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 3.5L10.5 8L6 12.5Z" fill="currentColor" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="7.5"
        r="3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5 20C5.8 16.7 8.3 14.8 12 14.8C15.7 14.8 18.2 16.7 19 20"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

// function HomeIcon() {
//   return (
//     <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
//       <path
//         d="M4 10.8L12 4L20 10.8V20H6.5V13.5H11V20"
//         fill="none"
//         stroke="currentColor"
//         strokeLinejoin="round"
//         strokeWidth="1.8"
//       />
//     </svg>
//   );
// }

function HelpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9.7 9.3C10 7.9 10.9 7.1 12.3 7.1C13.8 7.1 14.9 8.1 14.9 9.5C14.9 10.6 14.3 11.2 13.3 11.9C12.4 12.5 12 13 12 14"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="7.5"
        r="3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M6 20C6.9 16.8 9 15.2 12 15.2C15 15.2 17.1 16.8 18 20"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M4 5.5C3.1 6.7 2.5 8.2 2.5 10C2.5 11.7 3 13.2 4 14.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M20 5.5C20.9 6.7 21.5 8.2 21.5 10C21.5 11.7 21 13.2 20 14.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [boards, setBoards] = useState<HeaderBoardResponse[]>([]);
  const [isBoardsLoading, setIsBoardsLoading] = useState(true);
  const [boardsError, setBoardsError] = useState("");
  const [profile, setProfile] = useState<HeaderProfile | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isBoardOpen, setIsBoardOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNightMode, setIsNightMode] = useState(getStoredNightMode);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<ProjectSearchResponse>(() =>
    createEmptySearchResults(),
  );
  const [isHeaderSearchLoading, setIsHeaderSearchLoading] = useState(false);
  const [headerSearchError, setHeaderSearchError] = useState("");

  const headerRef = useRef<HTMLDivElement | null>(null);
  const activeBoardId = getBoardIdFromPath(location.pathname);
  const activeBoard = activeBoardId
    ? boards.find((board) => getBoardId(board) === activeBoardId)
    : undefined;
  const activeBoardLabel = activeBoard ? getBoardTitle(activeBoard) : defaultBoardLabel;
  const searchResultBoards = searchResults.boards ?? [];
  const searchResultCards = searchResults.cards ?? [];
  const hasHeaderSearchResults = searchResultBoards.length > 0 || searchResultCards.length > 0;
  const shouldShowHeaderSearchResults = isSearchOpen && searchValue.trim().length > 0;

  const closeMenus = () => {
    setIsBoardOpen(false);
    setIsMenuOpen(false);
  };

  function handleNightModeChange(nextIsNightMode: boolean) {
    setIsNightMode(nextIsNightMode);
    storeNightMode(nextIsNightMode);
  }

  function resetHeaderSearch() {
    setSearchValue("");
    setSearchResults(createEmptySearchResults());
    setHeaderSearchError("");
    setIsHeaderSearchLoading(false);
    setIsSearchOpen(false);
    closeMenus();
  }

  function handleHeaderSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;
    const nextQuery = nextValue.trim();

    setSearchValue(nextValue);
    setSearchResults(createEmptySearchResults(nextQuery));
    setHeaderSearchError("");
    setIsHeaderSearchLoading(Boolean(nextQuery));
  }

  function handleBoardSearchResultClick(result: BoardSearchResult) {
    const boardId = getSearchResultBoardPathId(result);

    if (!boardId) return;

    resetHeaderSearch();
    navigate(`/boards/${encodeURIComponent(boardId)}`);
  }

  function handleCardSearchResultClick(result: CardSearchResult) {
    const boardId = getSearchResultBoardPathId(result);
    const cardTitle = getSearchCardTitle(result);

    if (!boardId || !cardTitle) return;

    const params = new URLSearchParams({ cardSearch: cardTitle });

    resetHeaderSearch();
    navigate(`/boards/${encodeURIComponent(boardId)}?${params.toString()}`);
  }

  useEffect(() => {
    let ignore = false;

    async function loadBoards() {
      setIsBoardsLoading(true);
      setBoardsError("");

      try {
        const boardData = await fetchHeaderBoards();

        if (ignore) return;

        const nextBoards = boardData.filter((board) => getBoardTitle(board));

        setBoards(nextBoards);
      } catch {
        if (!ignore) {
          setBoards([]);
          setBoardsError("بردها بارگذاری نشدند");
        }
      } finally {
        if (!ignore) setIsBoardsLoading(false);
      }
    }

    async function loadProfile() {
      try {
        const profileData = await fetchHeaderProfile();
        if (!ignore) setProfile(profileData);
      } catch {
        if (!ignore) setProfile(null);
      }
    }

    loadBoards();
    loadProfile();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const compactSearchMedia = window.matchMedia(compactSearchQuery);

    const syncSearchLayout = () => {
      if (compactSearchMedia.matches) {
        setIsSearchOpen(false);
      }
    };

    syncSearchLayout();
    compactSearchMedia.addEventListener("change", syncSearchLayout);

    return () => {
      compactSearchMedia.removeEventListener("change", syncSearchLayout);
    };
  }, []);

  useEffect(() => {
    const query = searchValue.trim();

    if (!query) return;

    let ignore = false;
    const searchTimer = window.setTimeout(async () => {
      try {
        const nextResults = await searchProjects(query);

        if (!ignore) {
          setSearchResults(nextResults);
          setHeaderSearchError("");
        }
      } catch {
        if (!ignore) {
          setSearchResults(createEmptySearchResults(query));
          setHeaderSearchError("جستجو انجام نشد");
        }
      } finally {
        if (!ignore) setIsHeaderSearchLoading(false);
      }
    }, headerSearchDelayMs);

    return () => {
      ignore = true;
      window.clearTimeout(searchTimer);
    };
  }, [searchValue]);

  useEffect(() => {
    function closeFloatingPanels(event: MouseEvent) {
      if (
        event.target instanceof Node &&
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        closeMenus();
      }
    }

    document.addEventListener("mousedown", closeFloatingPanels);

    return () => {
      document.removeEventListener("mousedown", closeFloatingPanels);
    };
  }, []);

    return (
    <>
      <header
        className={`tak-header ${
          isNightMode ? "is-night-mode" : ""
        } bg-[var(--tak-page)] text-[var(--tak-text)]`}
        dir="rtl"
      >
        <div
          className={`tak-header-stage ${
            isSearchOpen ? "is-search-open" : ""
          }`}
          ref={headerRef}
        >
          <Button
            variant="doubleCircleSearch"
            aria-label={isSearchOpen ? "بستن جستجو" : "باز کردن جستجو"}
            aria-controls="tak-header-search"
            aria-expanded={isSearchOpen}
            className="tak-search-orb"
            onClick={() => {
              setIsSearchOpen((open) => !open);
              closeMenus();
            }}
          />

          <div className="tak-header-pill">
            <div
              id="tak-header-search"
              className={`tak-search-wrapper flex overflow-hidden transition-all duration-[360ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]${
                isSearchOpen ? " is-open" : ""
              }`}
            >
              <SearchInput
                value={searchValue}
                onChange={handleHeaderSearchChange}
                placeholder="جستجو"
                ariaLabel="جستجو"
              />
            </div>

            {shouldShowHeaderSearchResults && (
              <div
                className="tak-search-results-popover"
                role="listbox"
                aria-label="نتایج جستجو"
              >
                {isHeaderSearchLoading && (
                  <div className="tak-search-results-state">در حال جستجو...</div>
                )}

                {!isHeaderSearchLoading && headerSearchError && (
                  <div className="tak-search-results-state">{headerSearchError}</div>
                )}

                {!isHeaderSearchLoading && !headerSearchError && !hasHeaderSearchResults && (
                  <div className="tak-search-results-state">نتیجه‌ای پیدا نشد</div>
                )}

                {!isHeaderSearchLoading && !headerSearchError && searchResultBoards.length > 0 && (
                  <section className="tak-search-results-section" aria-label="بردها">
                    <p className="tak-search-results-heading">بردها</p>
                    {searchResultBoards.map((result, index) => {
                      const title = getSearchBoardTitle(result);
                      const meta =
                        result.project_name && result.project_name !== title
                          ? result.project_name
                          : result.match_excerpt;

                      return (
                        <button
                          key={`board-${result.project_id ?? result.board_id ?? result.id ?? index}`}
                          type="button"
                          className="tak-search-result-item"
                          onClick={() => handleBoardSearchResultClick(result)}
                        >
                          <span className="tak-search-result-title">{title}</span>
                          {meta && <span className="tak-search-result-meta">{meta}</span>}
                        </button>
                      );
                    })}
                  </section>
                )}

                {!isHeaderSearchLoading && !headerSearchError && searchResultCards.length > 0 && (
                  <section className="tak-search-results-section" aria-label="کارت‌ها">
                    <p className="tak-search-results-heading">کارت‌ها</p>
                    {searchResultCards.map((result, index) => {
                      const title = getSearchCardTitle(result);
                      const meta = [result.project_name, result.board_list_title]
                        .filter(Boolean)
                        .join(" / ");

                      return (
                        <button
                          key={`card-${result.id ?? index}`}
                          type="button"
                          className="tak-search-result-item"
                          onClick={() => handleCardSearchResultClick(result)}
                        >
                          <span className="tak-search-result-title">{title}</span>
                          {meta && <span className="tak-search-result-meta">{meta}</span>}
                          {result.match_excerpt && (
                            <span className="tak-search-result-excerpt">
                              {result.match_excerpt}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </section>
                )}
              </div>
            )}

            <div className="tak-board" dir="rtl">
              <button
                className="tak-board-button"
                type="button"
                aria-expanded={isBoardOpen}
                onClick={() => {
                  setIsBoardOpen((open) => !open);
                  setIsMenuOpen(false);
                }}
              >
                <ChevronDownIcon />
                <span>{activeBoardLabel}</span>
              </button>

              {isBoardOpen && (
                <div className="tak-dropdown tak-board-dropdown">
                  {isBoardsLoading && (
                    <div className="tak-dropdown-state">
                      در حال بارگذاری...
                    </div>
                  )}

                  {!isBoardsLoading && boardsError && (
                    <div className="tak-dropdown-state">{boardsError}</div>
                  )}

                  {!isBoardsLoading && !boardsError && boards.length === 0 && (
                    <div className="tak-dropdown-state">بردی پیدا نشد</div>
                  )}

                  {!isBoardsLoading &&
                    !boardsError &&
                    boards.map((board, index) => {
                      const boardTitle = getBoardTitle(board);
                      const boardId = getBoardId(board);
                      const isActiveBoard = boardId
                        ? boardId === activeBoardId
                        : boardTitle === activeBoardLabel;

                      return (
                        <button
                          className={`tak-dropdown-item ${
                            isActiveBoard ? "is-active" : ""
                          }`}
                          key={getBoardKey(board, index)}
                          type="button"
                          onClick={() => {
                            closeMenus();

                            if (boardId) {
                              navigate(`/boards/${boardId}`);
                            } else {
                              navigate("/boards");
                            }
                          }}
                        >
                          {boardTitle}
                        </button>
                      );
                    })}
                </div>
              )}
            </div>

            <Link className="tak-logo" to="/about-us" aria-label="کاربورد">
              <img className="tak-logo-image" src={logoUrl} alt="" />
            </Link>

            <div className="tak-menu-wrap">
              <button
                className="tak-menu-button"
                type="button"
                aria-expanded={isMenuOpen}
                aria-label="باز کردن منو"
                onClick={() => {
                  setIsMenuOpen((open) => !open);
                  setIsBoardOpen(false);
                }}
              >
                <MenuIcon />
              </button>

              {isMenuOpen && (
                <div className="tak-menu-popover">
                  <div className="tak-menu-section tak-menu-section-static">
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        `tak-menu-row ${isActive ? "is-active" : ""}`
                      }
                      onClick={closeMenus}
                    >
                      <span className="tak-menu-icon-slot">
                        <UserIcon />
                      </span>
                      <span className="tak-menu-label">داشبورد</span>
                      <span className="tak-menu-arrow">
                        <ArrowIcon />
                      </span>
                    </NavLink>

                    <NavLink
                      to="/boards"
                      className={({ isActive }) =>
                        `tak-menu-row ${isActive ? "is-active" : ""}`
                      }
                      onClick={closeMenus}
                    >
                      <span className="tak-menu-icon-slot">
                        <PanelsTopLeft
                          aria-hidden="true"
                          size={22}
                          strokeWidth={2.2}
                        />
                      </span>
                      <span className="tak-menu-label">بردهای من</span>
                      <span className="tak-menu-arrow">
                        <ArrowIcon />
                      </span>
                    </NavLink>

                    <NavLink
                      to="/faq"
                      className={({ isActive }) =>
                        `tak-menu-row ${isActive ? "is-active" : ""}`
                      }
                      onClick={closeMenus}
                    >
                      <span className="tak-menu-icon-slot">
                        <HelpIcon />
                      </span>
                      <span className="tak-menu-label">سوالات متداول</span>
                      <span className="tak-menu-arrow">
                        <ArrowIcon />
                      </span>
                    </NavLink>

                    <NavLink
                      to="/about-us"
                      className={({ isActive }) =>
                        `tak-menu-row ${isActive ? "is-active" : ""}`
                      }
                      onClick={closeMenus}
                    >
                      <span className="tak-menu-icon-slot">
                        <AboutIcon />
                      </span>
                      <span className="tak-menu-label">درباره ما</span>
                      <span className="tak-menu-arrow">
                        <ArrowIcon />
                      </span>
                    </NavLink>

                    <div className="tak-menu-row tak-night-row">
                      <span className="tak-menu-icon-slot">
                        <MoonStar
                          aria-hidden="true"
                          size={22}
                          strokeWidth={2.2}
                        />
                      </span>
                      <span className="tak-menu-label">حالت شب/روز</span>
                      <ToggleSwitch
                        checked={isNightMode}
                        onChange={handleNightModeChange}
                        aria-label="تغییر حالت شب/روز"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="doubleCircle"
            className="tak-profile"
            aria-label="پروفایل"
            onClick={() => {
              setIsProfileOpen(true);
              closeMenus();
            }}
          >
            <span className="tak-profile-photo">
              <img
                src={profile?.avatarUrl || defaultProfile}
                alt=""
                onError={(event) => {
                  event.currentTarget.src = defaultProfile;
                }}
              />
            </span>
          </Button>
        </div>
      </header>

      <MyProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
