import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const AddClients = React.lazy(() => import('./views/Clients/AddClients.js'))
const AllClients = React.lazy(() => import('./views/Clients/AllClients.js'))
const AddAdmin = React.lazy(() => import('./views/Admin/AddAdmin.js'))
const AllAdmin = React.lazy(() => import('./views/Admin/AllAdmin.js'))
const AddAccountant = React.lazy(() => import('./views/Accountant/AddAccountant.js'))
const AllAccountant = React.lazy(() => import('./views/Accountant/AllAccountant.js'))
const EditClients = React.lazy(() => import('./views/Clients/EditClient.js'))
const AddDrivers = React.lazy(() => import('./views/drivers/AddDrivers.js'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))
const AllJobs = React.lazy(() => import('./views/jobs/AllJobs.js'))
const AddJobs = React.lazy(() => import('./views/jobs/AddJobs.js'))
const AllDrivers = React.lazy(() => import('./views/drivers/allDrivers'))
const AllServiceType = React.lazy(() => import('./views/serviceType/AllServiceType.js'))
const AllServiceCode = React.lazy(() => import('./views/serviceCode/AllServiceCode.js'))
const LocationMap = React.lazy(() => import('./views/PackageLocation/LocationMap.js'))
const AllClientsJob = React.lazy(() => import('./views/Clients/AllClientsJob.js'))
const EditDriver = React.lazy(() => import('./views/drivers/EditDriver.js'))
const AllDriverJobs = React.lazy(() => import('./views/drivers/allDriverJobs.js'))
const ClientJobDetails = React.lazy(() => import('./views/Clients/ClientJobDetails.js'))
const ClientInvoice = React.lazy(() => import('./views/Clients/ClientInvoice.js'))
const AddClientJOb = React.lazy(() => import('./views/Clients/AddClientJob.js'))
const AllPickupLocation = React.lazy(() => import('./views/PickUPLocation/AllPickLocation.js'))
const AllDropLocation = React.lazy(() => import('./views/DropLocation/AllDropLocation.js'));
const Report = React.lazy(() => import('./views/reports/report.js'));
const AddVpap = React.lazy(() => import('./views/Clients/AddVpap.js'));
const routes = [
  // working routes current

  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/client/add', name: 'Add Client', element: AddClients },
    { path: '/admin/add', name: 'Add Client', element: AddAdmin },
  { path: '/client/all', name: 'All Client', element: AllClients },
    { path: '/admin/all', name: 'All Client', element: AllAdmin },
       { path: '/accountant/all', name: 'All Client', element: AllAccountant },
       { path: '/accountant/add', name: 'Add Client', element: AddAccountant },
  { path: '/client/:id/jobs', name: 'All Client Jobs', element: AllClientsJob },
  { path: '/client/job/add/:id', name: 'Add Client Job', element: AddClientJOb },
  { path: '/client/edit/:id', name: 'Edit Client', element: EditClients },
  { path: '/driver/add', name: 'Add Drivers', element: AddDrivers },
  { path: '/service/type', name: 'Service Type', element: AllServiceType },
  { path: '/service/code', name: 'Service Code', element: AllServiceCode },
  { path: '/driver/edit/:id', name: 'Edit Driver', element: EditDriver },
  { path: '/job/add', name: 'Add Booking', element: AddJobs },
  { path: '/location/:id', name: 'Location', element: LocationMap },
  { path: '/job/all', name: 'All Booking', element: AllJobs },
  { path: '/driver/all', name: 'All Drivers', element: AllDrivers },
  { path: '/driver/jobs/:id', name: 'All Driver Jobs', element: AllDriverJobs },
  { path: '/client/job/details/:id', name: 'Client Job Details', element: ClientJobDetails },
  { path: '/client/invoice/:id', name: 'Client Invoice', element: ClientInvoice },
  { path: '/location/pickup', name: 'Pickup Location', element: AllPickupLocation },
  { path: '/location/drop', name: 'Drop Location', element: AllDropLocation },
  { path: '/reports/stats', name: 'Report', element: Report },
  { path: '/client/vpap/add/:id', name: 'Add VPAP', element: AddVpap},

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

export default routes
