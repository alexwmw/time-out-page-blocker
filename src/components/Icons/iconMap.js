import {
  faArrowDownUpAcrossLine,
  faArrowRotateLeft,
  faBan,
  faCheck,
  faCheckCircle,
  faCircleInfo,
  faClock,
  faCog,
  faEllipsisVertical,
  faExclamationTriangle,
  faExternalLink,
  faFlask,
  faFloppyDisk,
  faGlobeEurope,
  faList,
  faListDots,
  faMinus,
  faMoon,
  faPalette,
  faPenToSquare,
  faPlug,
  faPlus,
  faQuestion,
  faQuestionCircle,
  faSearch,
  faSliders,
  faSort,
  faSun,
  faTimes,
  faTimesCircle,
  faTrashAlt,
  faUnlockKeyhole,
} from "@fortawesome/free-solid-svg-icons";

const iconMap = (type) => {
  return (
    {
      add: { iconClass: faPlus, iconTitle: "Add icon" },
      advanced: { iconClass: faFlask, iconTitle: "Advanced options icon" },
      appearance: {
        iconClass: faPalette,
        iconTitle: "Appearance options icon",
      },
      block: { iconClass: faBan, iconTitle: "Block icon" },
      check: { iconClass: faCheck, iconTitle: "Tick icon" },
      checkCircle: { iconClass: faCheckCircle, iconTitle: "Tick icon" },
      close: { iconClass: faTimes, iconTitle: "Close icon" },
      collapse: { iconClass: faMinus, iconTitle: "Collapse icon" },
      darkMode: { iconClass: faMoon, iconTitle: "Dark mode icon" },
      delete: { iconClass: faTrashAlt, iconTitle: "Close icon" },
      edit: { iconClass: faPenToSquare, iconTitle: "Edit icon" },
      expand: { iconClass: faEllipsisVertical, iconTitle: "Expand icon" },
      faq: { iconClass: faQuestion, iconTitle: "Help icon" },
      function: { iconClass: faPlug, iconTitle: "Function options icon" },
      help: { iconClass: faQuestionCircle, iconTitle: "Help icon" },
      information: { iconClass: faCircleInfo, iconTitle: "Info icon" },
      lightMode: { iconClass: faSun, iconTitle: "Light mode icon" },
      link: { iconClass: faExternalLink, iconTitle: "Link icon" },
      list: { iconClass: faListDots, iconTitle: "List icon" },
      more: { iconClass: faEllipsisVertical, iconTitle: "More icon" },
      options: { iconClass: faCog, iconTitle: "Options icon" },
      reset: { iconClass: faArrowRotateLeft, iconTitle: "Reset icon" },
      save: { iconClass: faFloppyDisk, iconTitle: "Save icon" },
      scheduling: { iconClass: faList, iconTitle: "Scheduling icon" },
      search: { iconClass: faSearch, iconTitle: "Search icon" },
      settings: { iconClass: faSliders, iconTitle: "Settings  icon" },
      sort: { iconClass: faSort, iconTitle: "Sort icon" },
      stop: { iconClass: faTimesCircle, iconTitle: "Stop icon" },
      swap: { iconClass: faArrowDownUpAcrossLine, iconTitle: "Swap icon" },
      time: { iconClass: faClock, iconTitle: "Time icon" },
      unblocked: { iconClass: faUnlockKeyhole, iconTitle: "Unblocked icon" },
      warning: { iconClass: faExclamationTriangle, iconTitle: "Warning icon" },
      world: { iconClass: faGlobeEurope, iconTitle: "World icon" },
    }[type] ?? {}
  );
};

export default iconMap;
