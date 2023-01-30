import { RouteComponentProps } from '@reach/router'
import { Field, FieldArray, Form, FormSpy, SubmitButton, FieldSpy } from '@repay/cactus-form'
import { ActionsAdd } from '@repay/cactus-icons'
import { Accordion, Box, Button, Flex, Text, TextButton } from '@repay/cactus-web'
import arrayMutators from 'final-form-arrays'
import React from 'react'
import { Helmet } from 'react-helmet'

import { post } from '../api'
import FieldsAccordion from '../components/FieldsAccordion'

interface Condition {
  id?: number
  variable: string
  operator: string
  value: string
}

interface Action {
  id?: number
  action: string
}

interface Rule {
  id?: number
  conditions: Condition[]
  actions: Action[]
}

type FormRules = { rules: Rule[] }

interface ArrayProps<T> {
  value: T[]
  name: string
  push: (v: Partial<T>) => void
  remove: (index: number) => void
  swap: (a: number, b: number) => void
}

const stripIds = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(stripIds)
  } else if (typeof obj === 'object') {
    return Object.keys(obj).reduce((newObj: any, key) => {
      if (key !== 'id') newObj[key] = stripIds(obj[key])
      return newObj
    }, {})
  }
  return obj
}

const Rules: React.FC<RouteComponentProps> = () => {
  const handleSubmit = async (values: FormRules): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 3000)).then(() => {
      post(stripIds(values).rules)
      console.log((window as any).apiData)
    })
  }
  return (
    <Form mutators={arrayMutators as any} onSubmit={handleSubmit}>
      <FieldArray name="rules" as={RulesForm} />
    </Form>
  )
}

const RulesForm = ({ value: rules, name, push, remove, swap }: ArrayProps<Rule>) => {
  const handleRuleUpClick = (index: number) => swap(index - 1, index)
  const handleRuleDownClick = (index: number) => swap(index, index + 1)
  return (
    <Box borderColor="base" borderWidth="2px" borderStyle="solid" marginX="5%">
      <Helmet>
        <title>Rules</title>
      </Helmet>
      <Text as="h2" colors="base" paddingLeft={3}>
        Rules
      </Text>

      <Box padding={4}>
        <Flex justifyContent="flex-end" marginBottom={4}>
          <TextButton variant="action" onClick={() => push({})}>
            <ActionsAdd mr={1} />
            Add Rule
          </TextButton>
        </Flex>

        <Accordion.Provider maxOpen={1}>
          {rules.map((rule, ruleIndex) => (
            <FieldsAccordion
              key={rule.id}
              index={ruleIndex}
              lastIndex={rules.length - 1}
              header={`Rule #${ruleIndex + 1}`}
              onDelete={remove}
              onUpClick={handleRuleUpClick}
              onDownClick={handleRuleDownClick}
              defaultOpen
            >
              <FieldArray as={Conditions} name={`${name}[${ruleIndex}].conditions`} />
              <FieldArray as={Actions} name={`${name}[${ruleIndex}].actions`} />
            </FieldsAccordion>
          ))}
        </Accordion.Provider>
        <Flex width="100%" justifyContent="center" mt={4} py={3}>
          <FormSpy subscription={{ dirty: true }}>
            {({ dirty }: { dirty: boolean }) => (
              <Button type="reset" variant="standard" mr={3} disabled={!dirty}>
                Reset
              </Button>
            )}
          </FormSpy>
          <SubmitButton ml={3} />
        </Flex>
      </Box>
    </Box>
  )
}

const Conditions = ({ value: conditions, name, push, remove, swap }: ArrayProps<Condition>) => {
  const handleConditionUpClick = (index: number) => swap(index - 1, index)
  const handleConditionDownClick = (index: number) => swap(index, index + 1)
  return (
    <>
      <Flex
        alignItems="center"
        width="100%"
        borderBottom="1px solid"
        borderBottomColor="lightContrast"
        pb={4}
        mb={4}
      >
        <Text as="h4">Conditions</Text>
        <TextButton ml="auto" variant="action" onClick={() => push({})}>
          <ActionsAdd mr={1} />
          Add Condition
        </TextButton>
      </Flex>
      <Accordion.Provider>
        {conditions.map((condition, conditionIndex) => (
          <FieldsAccordion
            as="h4"
            key={condition.id}
            index={conditionIndex}
            lastIndex={conditions.length - 1}
            header={`Condition #${conditionIndex + 1} with fI`}
            onDelete={remove}
            onUpClick={handleConditionUpClick}
            onDownClick={handleConditionDownClick}
            defaultOpen
          >
            <Field
              label="Name"
              name={`${name}[${conditionIndex}].variable`}
              options={['A variable', 'Another variable', 'Final variable']}
            />
            <FieldSpy
              fieldName={`${name}[${conditionIndex}].variable`}
              subscription={{ value: true }}
            >
              {({ value }) => (value ? <span>You have selected {value}.</span> : null)}
            </FieldSpy>
            <Field
              label="Operator"
              name={`${name}[${conditionIndex}].operator`}
              options={['Greater than', 'Less than', 'Equal to']}
            />
            <FieldSpy
              fieldName={`${name}[${conditionIndex}].operator`}
              subscription={{ value: true }}
            >
              {({ value }) => (!value ? <span>You need to select a value.</span> : null)}
            </FieldSpy>
            <Field
              label="Value"
              name={`${name}[${conditionIndex}].value`}
              options={['-1', '0', '1']}
            />
          </FieldsAccordion>
        ))}
      </Accordion.Provider>
    </>
  )
}

const Actions = ({ value: actions, name, push, remove, swap }: ArrayProps<Action>) => {
  const handleActionUpClick = (index: number) => swap(index - 1, index)
  const handleActionDownClick = (index: number) => swap(index, index + 1)
  return (
    <>
      <Flex
        alignItems="center"
        width="100%"
        borderBottom="1px solid"
        borderBottomColor="lightContrast"
        pb={4}
        mb={4}
        mt={5}
      >
        <Text as="h4">Actions</Text>
        <TextButton ml="auto" variant="action" onClick={() => push({})}>
          <ActionsAdd mr={1} />
          Add Action
        </TextButton>
      </Flex>
      <Accordion.Provider>
        {actions.map((action, actionIndex) => (
          <FieldsAccordion
            as="h4"
            key={action.id}
            index={actionIndex}
            lastIndex={actions.length - 1}
            header={`Action #${actionIndex + 1}`}
            onDelete={remove}
            onUpClick={handleActionUpClick}
            onDownClick={handleActionDownClick}
            defaultOpen
          >
            <Field
              label="Name"
              name={`${name}[${actionIndex}].action`}
              options={['Do the thing', 'Do another thing', 'Do no things']}
            />
          </FieldsAccordion>
        ))}
      </Accordion.Provider>
    </>
  )
}

export default Rules
