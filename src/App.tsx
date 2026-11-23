import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faArrowRightFromBracket,
  faBookOpen,
  faCalendarDays,
  faChartLine,
  faCircleQuestion,
  faClipboardCheck,
  faClipboardList,
  faCreditCard,
  faFile,
  faFileLines,
  faFlask,
  faGear,
  faGraduationCap,
  faHeartPulse,
  faHouse,
  faLandmark,
  faList,
  faMoneyBill,
  faPrint,
  faRightLeft,
  faServer,
  faTableCells,
  faUnlockKeyhole,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { getAttendance, getControlEvents, getProgressSubjects, semesters } from "./data/portalData";
import type { AttestationRow, Course, Subject } from "./data/portalData";

type Page = "home" | "performance";
type Tab = "Аттестация" | "Успеваемость" | "Посещаемость" | "Онлайн курсы" | "Зачетная книжка";
type Modal = { title: string; body: ReactNode; kind?: "logout" };

const tabs: Tab[] = ["Аттестация", "Успеваемость", "Посещаемость", "Онлайн курсы", "Зачетная книжка"];

const menuItems: { name: string; icon: IconDefinition; children: string[] }[] = [
  { name: "Личная информация", icon: faAddressCard, children: ["Мой профиль", "Личные данные"] },
  { name: "Мероприятия", icon: faCalendarDays, children: ["Афиша мероприятий", "Мои мероприятия"] },
  { name: "Учебная деятельность", icon: faGraduationCap, children: ["Успеваемость и посещаемость", "Расписание занятий", "Учебный план"] },
  { name: "Научная деятельность", icon: faFlask, children: ["Научные проекты", "Публикации"] },
  { name: "Мои заявления", icon: faLandmark, children: ["Подать заявление", "История заявлений"] },
  { name: "Опросы и акции", icon: faClipboardList, children: ["Доступные опросы", "Акции"] },
  { name: "Здоровье и спорт", icon: faHeartPulse, children: ["Спортивные секции", "Медицинская информация"] },
  { name: "Практики и трудоустройство", icon: faRightLeft, children: ["Практики", "Вакансии"] },
  { name: "Цифровые сервисы", icon: faServer, children: ["Сервисы ТПУ", "Электронная почта"] },
  { name: "Безопасность", icon: faFile, children: ["Правила безопасности", "Контакты"] },
];

const homeTiles: { title: string; icon: IconDefinition; page?: Page }[] = [
  { title: "Успеваемость и посещаемость", icon: faChartLine, page: "performance" },
  { title: "Расписание занятий", icon: faTableCells },
  { title: "Моя стипендия", icon: faCreditCard },
  { title: "Мои приказы", icon: faFileLines },
  { title: "Опросы и акции", icon: faClipboardList },
  { title: "Проверка на плагиат ВКР", icon: faClipboardCheck },
  { title: "Корпоративная печать MyQ", icon: faPrint },
  { title: "Оплата услуг", icon: faMoneyBill },
  { title: "Техподдержка", icon: faCircleQuestion },
  { title: "Инструкции", icon: faBookOpen },
];

const newsItems = [
  {
    date: "20.11.2026",
    title: "Вниманию студентов! В личном кабинете открыты вакансии карьерного портала Росатома",
    tag: "Общее",
  },
  {
    date: "20.11.2026",
    title: "Вниманию студентов групп 8К51Т, 8К52Т, 8К53Т, 8И52Т, 8В51Т, 8И52Т! Регистрация на мероприятия CRE и FunFlow продлена до 25.11.2026",
    tag: "Общее",
  },
];

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      className="brand brand-button"
      aria-label="Томский политехнический университет"
      onClick={onClick}
    >
      <img
        src="/logo.png"
        alt="Логотип ТПУ"
        className="brand-mark"
      />
      <div className="brand-wordmark">
        <span>ТОМСКИЙ</span>
        <span>ПОЛИТЕХНИЧЕСКИЙ</span>
        <span>УНИВЕРСИТЕТ</span>
      </div>
    </button>
  );
}

function Avatar() {
  return (
    <svg className="avatar" viewBox="0 0 44 52" aria-hidden="true">
      <defs>
        <linearGradient id="avatar-bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#d8d9dd" />
          <stop offset="1" stopColor="#bfc1c7" />
        </linearGradient>
      </defs>
      <rect width="44" height="52" rx="3" fill="url(#avatar-bg)" />
      <path d="M19 31c-1-3-4-4-4-9V18c0-8 3-12 9-12s10 5 10 13c0 3-1 6-3 9l-2 5 10 7 3 12H3l2-12z" fill="#999ba3" />
      <path d="m17 31 7 5 7-5-2 6-5 12-5-12z" fill="#e2e2e5" />
      <path d="m21 37 3 3 3-3-2 13h-2z" fill="#85868d" />
    </svg>
  );
}

function HomePage({
  onOpenPerformance,
  showInfo,
}: {
  onOpenPerformance: () => void;
  showInfo: (title: string) => void;
}) {
  return (
    <>
      <div className="old-portal-notice">
        <span>Старая версия личного кабинета </span>
        <a href="https://desktop.tpu.ru" target="_blank" rel="noreferrer">
          desktop.tpu.ru
        </a>
      </div>

      <button
        type="button"
        className="hero-banner"
        onClick={() => showInfo("Первокурсникам")}
      >
        <div className="hero-banner-text">ПЕРВОКУРСНИКАМ</div>
        <div className="hero-banner-decor" aria-hidden="true">
          <div className="hero-glow" />
        </div>
        <span className="hero-indicator" aria-hidden="true" />
      </button>

      <div className="quick-links home-quick-links" aria-label="Быстрые сервисы">
        {homeTiles.map((tile) => (
          <button
            key={tile.title}
            type="button"
            className="quick-link"
            onClick={() =>
              tile.page === "performance"
                ? onOpenPerformance()
                : showInfo(tile.title)
            }
          >
            <span className="quick-icon">
              <FontAwesomeIcon icon={tile.icon} />
            </span>
            <span>{tile.title}</span>
          </button>
        ))}
      </div>

      <section className="surface home-card news-card" aria-label="Новости">
        <div className="home-card-header">
          <h2>Новости</h2>
          <div className="news-socials" aria-label="Социальные сети">
            <a href="https://t.me/tpu_ru" target="_blank" rel="noreferrer" aria-label="Канал ТПУ">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 3C6.5 3 2 7.1 2 12.2c0 2.9 1.5 5.5 3.8 7.2-.2 1.2-.7 2.4-1.5 3.3 1.9-.1 3.7-.7 5.2-1.7.8.2 1.6.3 2.5.3 5.5 0 10-4.1 10-9.1S17.5 3 12 3Zm0 13.5c-2.6 0-4.7-1.9-4.7-4.3S9.4 7.9 12 7.9s4.7 1.9 4.7 4.3-2.1 4.3-4.7 4.3Z" />
              </svg>
            </a>
            <a href="https://vk.com/tpu_ru" target="_blank" rel="noreferrer" aria-label="ВКонтакте" className="news-vk">
              VK
            </a>
          </div>
        </div>

        <div className="news-list">
          {newsItems.map((item, idx) => (
            <article className="news-item" key={idx}>
              <time className="news-date">{item.date}</time>
              <button
                type="button"
                className="news-title"
                onClick={() => showInfo(item.title)}
              >
                {item.title}
              </button>
              <span className="news-tag">{item.tag}</span>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="inline-link home-card-link"
          onClick={() => showInfo("Все новости")}
        >
          Все новости
        </button>
      </section>

      <section className="surface home-card birthdays-card" aria-label="Дни рождения">
        <div className="home-card-header">
          <h2>Дни рождения</h2>
        </div>
        <p className="birthdays-empty">На этой неделе нет именинников</p>
        <button
          type="button"
          className="inline-link home-card-link"
          onClick={() => showInfo("Список дней рождений")}
        >
          Список дней рождений
        </button>
      </section>
    </>
  );
}

function PortalTable({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className="table-scroll">
      <table className={`portal-table ${className}`}>{children}</table>
    </div>
  );
}

function AttestationTable({ rows }: { rows: AttestationRow[] }) {
  return (
    <PortalTable className="attestation-table">
      <colgroup>
        <col style={{ width: "31.7%" }} /><col style={{ width: "9.7%" }} />
        <col style={{ width: "6.8%" }} /><col style={{ width: "7.1%" }} />
        <col style={{ width: "6.8%" }} /><col style={{ width: "7.1%" }} />
        <col style={{ width: "6.7%" }} /><col style={{ width: "6.7%" }} />
        <col style={{ width: "8.8%" }} /><col style={{ width: "8.6%" }} />
      </colgroup>
      <thead><tr>
        <th>Дисциплина</th><th>Вид аттестации</th><th>КТ1 - балл</th><th>КТ2 - балл</th>
        <th>КТ1 - макс</th><th>КТ2 - макс</th><th>ПА - балл</th><th>ПА - макс</th>
        <th>ИТОГО - балл</th><th>ИТОГО - макс</th>
      </tr></thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${row.title}-${index}`}>
            <td title={row.title}>{row.title}</td>
            <td title={row.assessment}>{row.assessment}</td>
            <td>{row.kt1}</td>
            <td>{row.kt2}</td>
            <td>{row.kt1Max}</td>
            <td>{row.kt2Max}</td>
            <td>{row.pa}</td>
            <td>{row.paMax}</td>
            <td>{row.total}</td>
            <td>{row.totalMax}</td>
          </tr>
        ))}
      </tbody>
    </PortalTable>
  );
}

function GradebookTable({ subjects }: { subjects: Subject[] }) {
  return (
    <PortalTable className="gradebook-table">
      <colgroup>
        <col style={{ width: "37.5%" }} /><col style={{ width: "16.8%" }} />
        <col style={{ width: "4.2%" }} /><col style={{ width: "3.2%" }} />
        <col style={{ width: "9.2%" }} /><col style={{ width: "8.7%" }} />
        <col style={{ width: "13.2%" }} /><col style={{ width: "7.2%" }} />
      </colgroup>
     <thead>
  <tr>
    <th>Дисциплина</th>
    <th>Вид аттестации</th>
    <th>Часы</th>
    <th>З.е.</th>
    <th>Сумма<br />баллов</th>
    <th>Симв.<br />оценка</th>
    <th>Трад. оценка</th>
    <th>Дата<br />сдачи</th>
  </tr>
</thead>
      <tbody>
        {subjects.length === 0 ? (
          <tr>
            <td colSpan={8} className="empty-table-cell">
              <div className="empty-table-state">
                <svg width="48" height="36" viewBox="0 0 64 48" fill="none" aria-hidden="true">
                  <path d="M12 10h40l8 16v14a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V26l8-16Z" stroke="#d0d5dd" strokeWidth="2.5" fill="#f9fafb" />
                  <path d="M4 26h18l4 6h12l4-6h18" stroke="#d0d5dd" strokeWidth="2.5" strokeLinejoin="round" />
                </svg>
                <span>Нет данных</span>
              </div>
            </td>
          </tr>
        ) : (
          subjects.map((subject, index) => (
            <tr key={`${subject.title}-${subject.assessment}-${index}`}>
              <td>{subject.title}</td><td>{subject.assessment}</td><td>{subject.hours}</td>
              <td>{subject.credits}</td><td>{subject.points}</td><td>{subject.letter}</td>
              <td>{subject.grade}</td><td>{subject.date}</td>
            </tr>
          ))
        )}
      </tbody>
    </PortalTable>
  );
}

function AttendanceTable({ semester }: { semester: number }) {
  const records = getAttendance(semester);
  return (
    <PortalTable className="attendance-table">
      <colgroup>
        <col style={{ width: "59.4%" }} /><col style={{ width: "9.6%" }} />
        <col style={{ width: "10%" }} /><col style={{ width: "21%" }} />
      </colgroup>
      <thead><tr><th>Дисциплина</th><th>КТ1 (час)</th><th>КТ2 (час)</th><th>Всего пропусков (час)</th></tr></thead>
      <tbody>{records.map((row) => (
        <tr key={row.title}>
          <td>{row.title}</td>
          <td>{row.firstMissed} из {row.firstHours}</td>
          <td>{row.secondMissed} из {row.secondHours}</td>
          <td>{row.firstMissed + row.secondMissed} из {row.firstHours + row.secondHours}</td>
        </tr>
      ))}</tbody>
    </PortalTable>
  );
}

function CoursesTable({ courses, onCourseClick }: { courses: Course[]; onCourseClick: (course: Course) => void }) {
  return (
    <PortalTable className="courses-table">
      <colgroup><col style={{ width: "59%" }} /><col style={{ width: "41%" }} /></colgroup>
      <thead><tr><th>Электронный курс</th><th>Ф.И.О. преподавателя(ей)</th></tr></thead>
      <tbody>{courses.map((course, index) => (
        <tr key={`${course.title}-${index}`}>
          <td><button className="table-link" onClick={() => onCourseClick(course)}>{course.title}</button></td>
          <td><button className="table-link" onClick={() => onCourseClick(course)}>{course.teacher}</button></td>
        </tr>
      ))}</tbody>
    </PortalTable>
  );
}

function EmptyTableRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="empty-table-cell">
        <div className="empty-table-state">
          <svg width="48" height="36" viewBox="0 0 64 48" fill="none" aria-hidden="true">
            <path d="M12 10h40l8 16v14a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V26l8-16Z" stroke="#d0d5dd" strokeWidth="2.5" fill="#f9fafb" />
            <path d="M4 26h18l4 6h12l4-6h18" stroke="#d0d5dd" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
          <span>Нет данных</span>
        </div>
      </td>
    </tr>
  );
}

function ProgressList({ semester, openRow, setOpenRow }: {
  semester: number;
  openRow: string | null;
  setOpenRow: (row: string | null) => void;
}) {
  return (
    <div className="progress-list">
      {getProgressSubjects(semester).map((title, index) => {
        const rowId = `${semester}-${index}`;
        const isOpen = openRow === rowId;
        const events = getControlEvents(semester, title, index);

        return (
          <div className="progress-item" key={rowId}>
            <button
              type="button"
              className="progress-trigger"
              aria-expanded={isOpen}
              onClick={() => setOpenRow(isOpen ? null : rowId)}
            >
              <ChevronRight className={isOpen ? "chevron-open" : ""} size={15} strokeWidth={1.6} />
              <span>{title}</span>
            </button>
            {isOpen && (
              <div className="progress-detail">
                <PortalTable className="control-table">
                  <colgroup>
                    <col style={{ width: "4%" }} /><col style={{ width: "34%" }} />
                    <col style={{ width: "19.5%" }} /><col style={{ width: "7.5%" }} />
                    <col style={{ width: "21.5%" }} /><col style={{ width: "13.5%" }} />
                  </colgroup>
                  <thead><tr>
                    <th>#</th><th>Контролирующее мероприятие</th><th>Дата проведения</th>
                    <th>Балл</th><th>Дата проставления</th><th>Макс. балл</th>
                  </tr></thead>
                  <tbody>
                    {events.length === 0 ? (
                      <EmptyTableRow colSpan={6} />
                    ) : (
                      events.map((event, eventIndex) => (
                        <tr key={event.name} className={event.isSummary ? "summary-row" : ""}>
                          <td>{eventIndex + 1}</td>
                          <td>{event.name}</td>
                          <td>{event.held}</td>
                          <td>{event.points}</td>
                          <td>{event.posted}</td>
                          <td>{event.max}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </PortalTable>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SiteFooter({ showInfo }: { showInfo: (title: string) => void }) {
  const columns = [
    ["Электронная почта", "Расписание занятий", "Техподдержка"],
    ["Мероприятия ТПУ", "Телефонный справочник", "Оплата услуг"],
    ["Научно-техническая библиотека ТПУ", "Профсоюз студентов", "Персональные сайты преподавателей", "Цифровые образовательные ресурсы ТПУ"],
    ["Профсоюз сотрудников", "Коллективный договор", "Противодействие коррупции", "При угрозе теракта"],
  ];
  return (
    <footer className="surface site-footer">
      <div className="footer-links">
        {columns.map((column, index) => (
          <div className="footer-column" key={index}>
            {column.map((link) => <button type="button" key={link} onClick={() => showInfo(link)}>{link}</button>)}
          </div>
        ))}
      </div>
      <div className="social-links" aria-label="Социальные сети ТПУ">
        <a href="https://vk.com/tpu_ru" target="_blank" rel="noreferrer" aria-label="ВКонтакте">ᴠκ</a>
        <a href="https://dzen.ru/tpu" target="_blank" rel="noreferrer" aria-label="Дзен" className="social-circle">D</a>
        <a href="https://t.me/tpu_ru" target="_blank" rel="noreferrer" aria-label="Телеграм">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 3.2 2 10.7c-.9.4-.9 1.3-.1 1.6l5 1.6 1.9 5.6c.2.7.6.9 1.2.4l2.8-2.7 5.1 3.8c.7.5 1.3.3 1.5-.6l3.3-15.8c.2-1-.3-1.7-1.1-1.4ZM8.2 13.4l10.7-7-8.3 8.4-.6 2.5z" /></svg>
        </a>
        <a href="https://ok.ru/group/54407921582202" target="_blank" rel="noreferrer" aria-label="Одноклассники" className="social-ok">я</a>
        <a href="https://rutube.ru/" target="_blank" rel="noreferrer" aria-label="Рутуб" className="social-r">R</a>
      </div>
      <div className="footer-copyright">
        <button type="button" onClick={() => showInfo("Томский политехнический университет")}>Национальный исследовательский Томский политехнический университет</button>
        <span>Все права защищены © 2022 - 2026</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [semester, setSemester] = useState(5);
  const [activeTab, setActiveTab] = useState<Tab>("Аттестация");
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [role, setRole] = useState("Студент");
  const [darkMode, setDarkMode] = useState(false);
  const [modal, setModal] = useState<Modal | null>(null);
  const [loggedOut, setLoggedOut] = useState(false);
  const studyRef = useRef<HTMLElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeRole = (event: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) setRoleOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModal(null);
        setRoleOpen(false);
        setGroupOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", closeRole);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("mousedown", closeRole);
      document.removeEventListener("keydown", closeEscape);
    };
  }, []);

  const openTab = (tab: Tab) => {
    setActiveTab(tab);
    setOpenRow(null);
    studyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showInfo = (title: string) => setModal({
    title,
    body: <p>Раздел «{title}» представлен в демонстрационной версии личного кабинета ТПУ.</p>,
  });

  const goHome = () => {
    setPage("home");
    setOpenMenu(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPerformance = () => {
    setPage("performance");
    setSemester(5);
    setActiveTab("Аттестация");
    setOpenRow(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMenuChild = (name: string) => {
    setMobileMenuOpen(false);
    if (name === "Успеваемость и посещаемость") goPerformance();
    else showInfo(name);
  };

  const openCourse = (course: Course) => setModal({
    title: course.title,
    body: <><p><strong>Преподаватель:</strong> {course.teacher}</p><p>Электронный курс для студентов группы 8И41. Ссылка на учебные материалы появится после подключения к сервисам университета.</p></>,
  });

  const renderTab = () => {
    const data = semesters[semester];
    switch (activeTab) {
      case "Аттестация": return <AttestationTable rows={data.attestation} />;
      case "Успеваемость": return <ProgressList semester={semester} openRow={openRow} setOpenRow={setOpenRow} />;
      case "Посещаемость": return <AttendanceTable semester={semester} />;
      case "Онлайн курсы": return <CoursesTable courses={data.courses} onCourseClick={openCourse} />;
      case "Зачетная книжка": return <GradebookTable subjects={data.subjects} />;
    }
  };

  return (
    <div className={`site-shell${darkMode ? " theme-dark" : ""}`}>
      <aside className={`sidebar${mobileMenuOpen ? " sidebar-visible" : ""}`}>
        <Brand onClick={goHome} />
        <button className="profile" type="button" onClick={() => showInfo("Личная информация")}>
          <Avatar />
          <span>Мирошниченко Владимир<br />Игоревич</span>
        </button>
        <div className="menu-heading">ОСНОВНОЕ МЕНЮ</div>
        <nav className="side-menu" aria-label="Основное меню">
          {menuItems.map(({ name, icon, children }) => (
            <div className="side-menu-item" key={name}>
              <button
                type="button"
                className="side-menu-button"
                aria-expanded={openMenu === name}
                onClick={() => setOpenMenu(openMenu === name ? null : name)}
              >
                <FontAwesomeIcon icon={icon} className="menu-icon" />
                <span className="menu-label">{name}</span>
                <span className="menu-arrow"><ChevronRight size={14} strokeWidth={1.5} /></span>
              </button>
              {openMenu === name && (
                <div className="side-submenu">
                  {children.map((child) => (
                    <button
                      key={child}
                      type="button"
                      className={page === "performance" && child === "Успеваемость и посещаемость" ? "submenu-active" : ""}
                      onClick={() => handleMenuChild(child)}
                    >
                      {child}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {mobileMenuOpen && <button className="mobile-backdrop" aria-label="Закрыть меню" onClick={() => setMobileMenuOpen(false)} />}

      <div className="page-column">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu-button header-button" type="button" aria-label="Открыть меню" onClick={() => setMobileMenuOpen(true)}><Menu size={19} /></button>
            <button
              className={`home-button header-button${page === "home" ? " header-button-active" : ""}`}
              type="button"
              aria-label="На главную"
              onClick={goHome}
            >
              <FontAwesomeIcon icon={faHouse} />
            </button>
          </div>
          <div className="topbar-right">
            <div className="role-selector" ref={roleRef}>
              <button type="button" className="role-button" aria-expanded={roleOpen} onClick={() => setRoleOpen(!roleOpen)}>
                {role}<ChevronDown size={15} strokeWidth={1.3} />
              </button>
              {roleOpen && <div className="role-menu">
                {["Студент", "Сотрудник"].map((option) => <button key={option} type="button" onClick={() => { setRole(option); setRoleOpen(false); }}>{option}</button>)}
              </div>}
            </div>
            <button type="button" className="theme-switch" aria-label={darkMode ? "Включить светлую тему" : "Включить темную тему"} aria-pressed={darkMode} onClick={() => setDarkMode(!darkMode)}>
              <FontAwesomeIcon icon={faGear} /><span className="theme-knob" />
            </button>
            <button type="button" className="logout-button header-button" aria-label="Выйти" onClick={() => setModal({ title: "Выход из личного кабинета", body: <p>Вы уверены, что хотите выйти из личного кабинета?</p>, kind: "logout" })}><FontAwesomeIcon icon={faArrowRightFromBracket} /></button>
          </div>
        </header>

        <main className="main-content">
          <h1 className="page-title">
            {page === "home" ? "ЛИЧНЫЙ КАБИНЕТ" : "УСПЕВАЕМОСТЬ И ПОСЕЩАЕМОСТЬ"}
          </h1>

          <div className="content-inner">
            {page === "home" ? (
              <HomePage onOpenPerformance={goPerformance} showInfo={showInfo} />
            ) : (
              <>
                <div className="quick-links" aria-label="Полезные ссылки">
                  <button type="button" className="quick-link" onClick={() => openTab("Посещаемость")}><span className="quick-icon"><FontAwesomeIcon icon={faUserClock} /></span><span>Посещаемость согласно СКУД</span></button>
                  <button type="button" className="quick-link" onClick={() => openTab("Успеваемость")}><span className="quick-icon"><FontAwesomeIcon icon={faUnlockKeyhole} /></span><span>Доступ к просмотру успеваемости</span></button>
                  <button type="button" className="quick-link" onClick={() => setModal({ title: "Система оценивания до 2018 года", body: <p>Информация о системе оценивания для студентов, поступивших до 2018 года. Итоговая оценка определяется по результатам текущего контроля и промежуточной аттестации.</p> })}><span className="quick-icon"><FontAwesomeIcon icon={faList} /></span><span>Система оценивания до 2018 года</span></button>
                  <button type="button" className="quick-link" onClick={() => setModal({ title: "Система оценивания после 2018 года", body: <p>Результат по дисциплине складывается из баллов за контрольные точки и промежуточную аттестацию. Максимальная сумма составляет 100 баллов.</p> })}><span className="quick-icon"><FontAwesomeIcon icon={faList} /></span><span>Система оценивания после 2018 года</span></button>
                </div>

                <section className="surface announcements" aria-label="Объявления">
                  <div className="announcement-block">
                    <strong>Уважаемые студенты!</strong>
                    <p>Ведутся работы по интеграции личного кабинета студента с сервисом успеваемости. Актуальные сведения об успеваемости и посещаемости занятий будут доступны в полном объеме после 20 ноября.</p>
                  </div>
                  <hr />
                  <div className="announcement-block">
                    <strong>Уважаемые студенты!</strong>
                    <p>Установлены даты комиссий по ликвидации академических задолженностей для студентов 2-5 курса.</p>
                    <p>В файле во вкладке выберите свою школу.</p>
                    <button type="button" className="inline-link" onClick={() => setModal({ title: "Расписание комиссий", body: <><p>Предварительное расписание комиссий по ликвидации академических задолженностей для студентов 2-5 курса.</p><p>Выберите свою школу в опубликованном файле расписания. Уточняйте дату и время в учебном офисе.</p></> })}>Посмотреть расписание</button>
                  </div>
                </section>

                <section className="surface study-panel" ref={studyRef} aria-label="Успеваемость и посещаемость по семестрам">
                  <div className="study-controls">
                    <div className="control-line">
  <span>Учебный план группы</span>
  <a
    href="https://up.tpu.ru/view/detali.html?id=30876"
    target="_blank"
    rel="noreferrer"
    className="small-button small-link-button"
  >
    8И41
  </a>
</div>
<div className="control-line group-line">
  <span>Выберите группу</span>
  <button
    type="button"
    className="small-button selected-group"
    onClick={() => {
      setSemester(5);
      setOpenRow(null);
    }}
  >
    8И41
  </button>
</div>
                    <div className="control-line semester-line">
                      <span>Выбор семестра</span>
                      <div className="semester-selector" role="group" aria-label="Выбор семестра">
                        {[1, 2, 3, 4, 5].map((number) => (
                          <button
                            type="button"
                            key={number}
                            className={semester === number ? "semester-active" : ""}
                            aria-pressed={semester === number}
                            onClick={() => { setSemester(number); setOpenRow(null); }}
                          >{number}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="record-number">Номер зачетной книжки: 8И41120</p>
                  <div className="study-tabs" role="tablist" aria-label="Сведения об учебе">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        id={`tab-${tabs.indexOf(tab)}`}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab}
                        aria-controls="study-tab-panel"
                        className={activeTab === tab ? "study-tab active" : "study-tab"}
                        onClick={() => { setActiveTab(tab); setOpenRow(null); }}
                      >{tab}</button>
                    ))}
                  </div>
                  <div className="study-tab-content" id="study-tab-panel" role="tabpanel" aria-labelledby={`tab-${tabs.indexOf(activeTab)}`}>
                    {renderTab()}
                  </div>
                </section>
              </>
            )}

            <SiteFooter showInfo={showInfo} />
          </div>
        </main>
      </div>

      {modal && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
          <div className="modal-window" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button type="button" className="modal-close" aria-label="Закрыть" onClick={() => setModal(null)}><X size={19} /></button>
            <h2 id="modal-title">{modal.title}</h2>
            <div className="modal-body">{modal.body}</div>
            <div className="modal-actions">
              {modal.kind === "logout" && <button type="button" className="modal-primary" onClick={() => { setLoggedOut(true); setModal(null); }}>Выйти</button>}
              <button type="button" className="modal-secondary" onClick={() => setModal(null)}>{modal.kind === "logout" ? "Отмена" : "Закрыть"}</button>
            </div>
          </div>
        </div>
      )}

      {loggedOut && <div className="logged-out-screen"><Brand /><h2>Вы вышли из личного кабинета</h2><button type="button" onClick={() => { setLoggedOut(false); goHome(); }}>Вернуться в кабинет</button></div>}
    </div>
  );
}