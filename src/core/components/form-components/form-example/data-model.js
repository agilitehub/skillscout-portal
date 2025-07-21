const bpmProfileKey = 'form_example'
/**
 * Configuration object for form fields used in the example form
 */
const formData = {
  firstName: {
    readOnly: false,
    label: 'First Name',
    name: 'firstName',
    rules: [],
    placeholder: 'Enter first name'
  },
  lastName: {
    readOnly: false,
    label: 'Last Name',
    name: 'lastName',
    rules: [],
    placeholder: 'Enter last name'
  },
  email: {
    readOnly: false,
    label: 'Email',
    name: 'email',
    rules: [{ type: 'email', message: 'Please enter a valid email' }],
    placeholder: 'Enter email address'
  },
  phone: {
    readOnly: false,
    label: 'Phone Number',
    name: 'phone',
    placeholder: 'Enter phone number'
  },
  jobTitle: {
    readOnly: false,
    label: 'Job Title',
    name: 'jobTitle',
    rules: [],
    placeholder: 'Enter job title'
  },
  bio: {
    readOnly: false,
    label: 'Bio',
    name: 'bio',
    placeholder: 'Tell us about yourself',
    rules: [],
    rows: 4
  },
  address: {
    readOnly: false,
    label: 'Address',
    name: 'address',
    placeholder: 'Enter address',
    rules: [],
    rows: 3
  },
  department: {
    readOnly: false,
    label: 'Department',
    name: 'department',
    placeholder: 'Select department',
    options: [
      { value: 'hr', label: 'Human Resources' },
      { value: 'it', label: 'Information Technology' },
      { value: 'finance', label: 'Finance' },
      { value: 'marketing', label: 'Marketing' }
    ],
    rules: []
  },
  employmentType: {
    readOnly: false,
    label: 'Employment Type',
    name: 'employmentType',
    rules: [{ required: true, message: 'Please select employment type' }],
    options: [
      { value: 'fulltime', label: 'Full-time' },
      { value: 'parttime', label: 'Part-time' },
      { value: 'contract', label: 'Contract' },
      { value: 'freelance', label: 'Freelance' }
    ],
    rules: []
  },
  benefits: {
    readOnly: false,
    label: 'Benefits',
    name: 'benefits',
    options: [
      { value: 'medical', label: 'Medical Insurance' },
      { value: 'dental', label: 'Dental Insurance' },
      { value: 'vision', label: 'Vision Insurance' },
      { value: 'retirement', label: 'Retirement Plan' },
      { value: 'gym', label: 'Gym Membership' },
      { value: 'meals', label: 'Free Meals' }
    ],
    rules: [],
    className: 'grid grid-cols-2 gap-2'
  },
  activeStatus: {
    readOnly: false,
    label: 'Active Status',
    name: 'activeStatus',
    checkedChildren: 'Active',
    unCheckedChildren: 'Inactive',
    defaultChecked: true,
    rules: []
  },
  joinDate: {
    readOnly: false,
    label: 'Date of Joining',
    name: 'joinDate',
    rules: [],
    placeholder: 'Select joining date'
  },
  dob: {
    readOnly: false,
    label: 'Date of Birth',
    name: 'dob',
    rules: [],
    placeholder: 'Select date of birth'
  },
  workingHours: {
    readOnly: false,
    label: 'Working Hours',
    name: 'workingHours',
    isRange: true,
    format: 'HH:mm',
    placeholder: ['Start time', 'End time'],
    rules: []
  },
  projectCount: {
    readOnly: false,
    label: 'Number of Projects',
    name: 'projectCount',
    rules: [],
    placeholder: 'Enter number of projects',
    min: 0,
    max: 100
  }
}

/**§
 * Example sidebar data configuration
 */
const sidebarData = {
  isAutoStep: false,
  submitLabel: 'Submit',
  options: [],
  selectedOption: null,
  refNo: 'EDRG-4547',
  title: 'Example Form Request for John Jardin',
  status: 'Draft',
  role: 'Direct Manager',
  phase: 'Approval',
  duration: '3 days',
  dueDate: '14 April 2025',
  requester: 'reamy.muong@mail.weir',
  responsible: 'faisal.nabi@mail.weir',
  instruction: 'Review the outstanding service request from your team for escalating issue during onboarding'
}

const dataModel = {
  bpmProfileKey,
  formData,
  sidebarData
}

export default dataModel