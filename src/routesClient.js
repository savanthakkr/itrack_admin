import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboardClient/Dashboard.js'))
const AllJobs = React.lazy(() => import('./views/dashboardClient/AllJobs.js'))
const AddJobs = React.lazy(() => import('./views/dashboardClient/AddJobs.js'))
const Profile = React.lazy(() => import('./views/dashboardClient/Profile.js'))
const JobView = React.lazy(() => import('./views/dashboardClient/JobView.js'))
const TrackDriver = React.lazy(() => import('./views/dashboardClient/TrackDriver.js'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors.js'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography.js'))
const LocationMapClient = React.lazy(() => import('./views/dashboardClient/LocationMapClient.js'))
const Report = React.lazy(() => import('./views/dashboardClient/Report.js'))
// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion.js'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs.js'))
const Cards = React.lazy(() => import('./views/base/cards/Cards.js'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels.js'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses.js'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups.js'))
const Navs = React.lazy(() => import('./views/base/navs/Navs.js'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations.js'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders.js'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers.js'))
const Progress = React.lazy(() => import('./views/base/progress/Progress.js'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners.js'))
const Tables = React.lazy(() => import('./views/base/tables/Tables.js'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips.js'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons.js'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups.js'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns.js'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios.js'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels.js'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl.js'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup.js'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout.js'))
const Range = React.lazy(() => import('./views/forms/range/Range.js'))
const Select = React.lazy(() => import('./views/forms/select/Select.js'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation.js'))

const Charts = React.lazy(() => import('./views/charts/Charts.js'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons.js'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags.js'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands.js'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts.js'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges.js'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals.js'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts.js'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets.js'))

const routesClient = [
  // working routes current

  { path: '/', exact: true, name: 'Home' },
  { path: '/client/dashboards', name: 'Dashboard', element: Dashboard },
  { path: '/client/dashboard/job/all', name: 'All Booking', element: AllJobs },
  { path: '/client/dashboard/job/add', name: 'Add Booking', element: AddJobs },
  { path: '/client/dashboard/profile', name: 'Profile', element: Profile },
  { path: '/client/dashboard/job/:id', name: 'Profile', element: JobView },
  { path: '/client/dashboard/job/:id/:driverId', name: 'Profile', element: TrackDriver },
  { path: '/client/dashboard/location/:id', name: 'track-location', element: LocationMapClient },
  { path: '/client/dashboard/reports/stats', name: 'Report', element: Report },

  //  theme routes old

  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routesClient
