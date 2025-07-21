import FormLayout from './FormLayout'
import FormContent from './FormContent'
import FormSidebar from './FormSidebar'

export { FormLayout, FormContent, FormSidebar }

/**
 * Form Layout Components
 *
 * This module provides standardized layout components for all forms in the application:
 *
 * - FormLayout: The main container component that structures the overall form layout
 * - FormContent: The main content area where form fields are displayed
 * - FormSidebar: A vertical card component that displays metadata and actions
 *
 * @example
 * import { FormLayout, FormContent, FormSidebar } from '../ui/form-components/form-layout'
 *
 * const MyForm = () => {
 *   return (
 *     <FormLayout
 *       content={
 *         <FormContent>
 *           Form fields go here
 *         </FormContent>
 *       }
 *     />
 *   )
 * }
 *
 * const MySidebarForm = () => {
 *   // Using new sidebar layout
 *   return (
 *     <Row gutter={[16, 16]}>
 *       <Col xs={24} lg={16}>
 *         <Card>
 *           Form fields go here
 *         </Card>
 *       </Col>
 *       <Col xs={24} lg={8}>
 *         <FormSidebar
 *           data={sidebarData}
 *           onSubmit={handleSubmit}
 *           requiredCompletion={60}
 *           additionalCompletion={25}
 *         />
 *       </Col>
 *     </Row>
 *   )
 * }
 */
