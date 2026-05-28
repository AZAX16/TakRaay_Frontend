import { useEffect, useRef, useState } from "react";
import { Button, ToggleSwitch } from "../ui-kit/Button";
import { SearchInput } from "../ui-kit/Input";
import {
  fetchHeaderBoards,
  fetchHeaderProfile,
  fetchRecentBoards,
  searchBoards,
  type HeaderBoardResponse,
  type HeaderProfile,
} from "../../services/headerApi";
import logoUrl from "../../assets/white1.webp";
import "./Header.css";

const fallbackBoards = ["برد شماره ۱۰", "برد شماره ۱۱", "برد شماره ۱۲", "برد شماره ۱۳"];
const fallbackRecentBoards = ["برد ۱۲", "برد حسن آقا", "بورد", "My Board"];
const shouldUseHeaderApi = import.meta.env.VITE_ENABLE_HEADER_API === "true";
const compactSearchQuery = "(max-width: 980px)";

function getBoardTitle(board: HeaderBoardResponse): string {
  if (typeof board === "string") return board;
  return board.title || board.name || String(board.id || "");
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

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 10.8L12 4L20 10.8V20H6.5V13.5H11V20"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

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

export default function Header() {
  const [activeBoard, setActiveBoard] = useState("برد شماره ۱۲");
  const [boards, setBoards] = useState<string[]>(fallbackBoards);
  const [recentBoards, setRecentBoards] = useState<string[]>(fallbackRecentBoards);
  const [profile, setProfile] = useState<HeaderProfile | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia(compactSearchQuery).matches;
  });
  const [isBoardOpen, setIsBoardOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadHeaderData() {
      if (!shouldUseHeaderApi) return;

      try {
        const [boardData, recentBoardData, profileData] = await Promise.all([
          fetchHeaderBoards(),
          fetchRecentBoards(),
          fetchHeaderProfile(),
        ]);

        if (ignore) return;

        if (Array.isArray(boardData) && boardData.length > 0) {
          setBoards(boardData.map(getBoardTitle).filter(Boolean));
        }

        if (Array.isArray(recentBoardData) && recentBoardData.length > 0) {
          setRecentBoards(recentBoardData.map(getBoardTitle).filter(Boolean));
        }

        setProfile(profileData);
      } catch {
        if (!ignore) {
          setBoards(fallbackBoards);
          setRecentBoards(fallbackRecentBoards);
        }
      }
    }

    loadHeaderData();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const compactSearchMedia = window.matchMedia(compactSearchQuery);
    const syncSearchLayout = () => {
      setIsSearchOpen(!compactSearchMedia.matches);
    };

    syncSearchLayout();
    compactSearchMedia.addEventListener("change", syncSearchLayout);

    return () => {
      compactSearchMedia.removeEventListener("change", syncSearchLayout);
    };
  }, []);

  useEffect(() => {
    function closeFloatingPanels(event: MouseEvent) {
      if (
        event.target instanceof Node &&
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        setIsBoardOpen(false);
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", closeFloatingPanels);
    return () => document.removeEventListener("mousedown", closeFloatingPanels);
  }, []);

  useEffect(() => {
    if (!shouldUseHeaderApi || !searchValue.trim()) return;

    const timeoutId = window.setTimeout(async () => {
      try {
        await searchBoards(searchValue.trim());
      } catch {
        // Placeholder endpoint: keep local UI responsive until the API is wired.
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchValue]);

  return (
    <header
      className={`tak-header ${isNightMode ? "is-night-mode" : ""} bg-[var(--tak-page)] text-[var(--tak-text)]`}
      dir="rtl"
    >
      <div
        className={`tak-header-stage ${isSearchOpen ? "is-search-open" : ""}`}
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
            setIsBoardOpen(false);
            setIsMenuOpen(false);
          }}
        />

        <div className="tak-header-pill">
          <div
            id="tak-header-search"
            className={`tak-search-wrapper flex overflow-hidden transition-all duration-[360ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]${isSearchOpen ? " is-open" : ""}`}
          >
            <SearchInput
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="جستجو"
              ariaLabel="جستجو"
            />
          </div>

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
              <span>{activeBoard}</span>
            </button>

            {isBoardOpen && (
              <div className="tak-dropdown tak-board-dropdown">
                {boards.map((board) => (
                  <button
                    className={`tak-dropdown-item ${
                      board === activeBoard ? "is-active" : ""
                    }`}
                    key={board}
                    type="button"
                    onClick={() => {
                      setActiveBoard(board);
                      setIsBoardOpen(false);
                    }}
                  >
                    {board}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a className="tak-logo" href="/" aria-label="کاربورد">
            <img className="tak-logo-image" src={logoUrl} alt="" />
          </a>

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
                <div className="tak-menu-section">
                  {recentBoards.map((board) => (
                    <button
                      className="tak-menu-row tak-menu-row-board"
                      key={board}
                      type="button"
                      onClick={() => {
                        setActiveBoard(board);
                        setIsMenuOpen(false);
                      }}
                    >
                      <span className="tak-menu-icon-slot" />
                      <span className="tak-menu-label">{board}</span>
                      <span className="tak-menu-arrow">
                        <ArrowIcon />
                      </span>
                    </button>
                  ))}
                </div>

                <div className="tak-menu-section tak-menu-section-static">
                  <a className="tak-menu-row" href="#">
                    <span className="tak-menu-icon-slot">
                      <UserIcon />
                    </span>
                    <span className="tak-menu-label">داشبورد</span>
                    <span className="tak-menu-arrow">
                      <ArrowIcon />
                    </span>
                  </a>
                  <a className="tak-menu-row" href="#">
                    <span className="tak-menu-icon-slot">
                      <HomeIcon />
                    </span>
                    <span className="tak-menu-label">بورد های من</span>
                    <span className="tak-menu-arrow">
                      <ArrowIcon />
                    </span>
                  </a>
                  <a className="tak-menu-row" href="#">
                    <span className="tak-menu-icon-slot">
                      <HelpIcon />
                    </span>
                    <span className="tak-menu-label">سوالات متداول</span>
                    <span className="tak-menu-arrow">
                      <ArrowIcon />
                    </span>
                  </a>

                  <div className="tak-menu-row tak-night-row">
                    <span className="tak-menu-icon-slot" />
                    <span className="tak-menu-label">حالت شب/روز</span>
                    <ToggleSwitch
                      checked={isNightMode}
                      onChange={setIsNightMode}
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
          onClick={() => window.location.href = "/profile"}
        >
          <span className="tak-profile-photo">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" />
            ) : (
              <>
                <span className="tak-profile-face" />
                <span className="tak-profile-shirt" />
              </>
            )}
          </span>
        </Button>
      </div>
    </header>
  );
}
