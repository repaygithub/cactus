import { RouteComponentProps } from '@reach/router'
import { Field, Form } from '@repay/cactus-form'
import { ActionsAdd } from '@repay/cactus-icons'
import { Accordion, Box, Button, Flex, Text, TextButton } from '@repay/cactus-web'
import arrayMutators from 'final-form-arrays'
import React from 'react'
import { useForm } from 'react-final-form'
import { Helmet } from 'react-helmet'

import { post } from '../api'
import FieldsAccordion from '../components/FieldsAccordion'

interface FieldInfo {
  name: string
  key: string
}

interface Condition {
  variable: string
  operator: string
  value: string
}

type Action = { action: string }

interface Rule {
  conditions: Condition[]
  actions: Action[]
}

type FormRules = { rules: Rule[] }

type RuleSubComponent = React.FC<{ ruleName: string }>

type KeyPrefix = 'rule' | 'condition' | 'action'

const keyCounters: { [K in KeyPrefix]: number } = {
  rule: 0,
  condition: 0,
  action: 0,
}

const Rules: React.FC<RouteComponentProps> = () => {
  const handleSubmit = ({ rules }: FormRules): void => {
    post(rules)
    console.log((window as any).apiData)
  }
  return (
    <Form mutators={arrayMutators as any} onSubmit={handleSubmit}>
      <RulesForm />
    </Form>
  )
}

const useFieldArray = (name: string, prefix: KeyPrefix) => {
  const form = useForm('useFieldArray')
  const [fields, setFields] = React.useState<FieldInfo[]>([])
  const [newestKey, setNewest] = React.useState<string>('')
  React.useEffect(
    () =>
      form.registerField(
        name,
        ({ value }: { value?: any[] }) => {
          if (value) {
            setFields((old) => {
              const sameLength = value.length === old.length
              const sameKeys = sameLength && value.every((v, i) => v.key === old[i].key)
              return sameKeys ? old : value.map((v, i) => ({ name: `${name}[${i}]`, key: v.key }))
            })
          }
        },
        { value: true, length: true }
      ),
    [name, form, setFields]
  )
  return {
    fields,
    newestKey,
    add: () => {
      const key = `${prefix}-${keyCounters[prefix]++}`
      form.mutators.push(name, { key })
      setNewest(key)
    },
    remove: (index: number) => form.mutators.remove(name, index),
    moveUp: (index: number) => form.mutators.swap(name, index - 1, index),
    moveDown: (index: number) => form.mutators.swap(name, index, index + 1),
  }
}

const RulesForm = () => {
  const {
    fields: rules,
    newestKey: newestRule,
    add: handleAddRule,
    remove: handleDeleteRule,
    moveUp: handleRuleUpClick,
    moveDown: handleRuleDownClick,
  } = useFieldArray('rules', 'rule')
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
          <TextButton variant="action" onClick={handleAddRule}>
            <ActionsAdd mr={1} />
            Add Rule
          </TextButton>
        </Flex>

        <Accordion.Provider maxOpen={1}>
          {rules.map((rule, ruleIndex) => (
            <FieldsAccordion
              key={rule.key}
              index={ruleIndex}
              lastIndex={rules.length - 1}
              header={`Rule #${ruleIndex + 1}`}
              onDelete={handleDeleteRule}
              onUpClick={handleRuleUpClick}
              onDownClick={handleRuleDownClick}
              defaultOpen={rule.key === newestRule}
            >
              <Conditions ruleName={rule.name} />
              <Actions ruleName={rule.name} />
            </FieldsAccordion>
          ))}
        </Accordion.Provider>
        <Flex width="100%" justifyContent="center" mt={4} py={3}>
          <Button type="reset" variant="standard" mr={3}>
            Reset
          </Button>
          <Button type="submit" variant="action" ml={3}>
            Submit
          </Button>
        </Flex>
      </Box>
    </Box>
  )
}

const Conditions: RuleSubComponent = ({ ruleName }) => {
  const {
    fields: conditions,
    newestKey: newestCondition,
    add: handleAddCondition,
    remove: handleDeleteCondition,
    moveUp: handleConditionUpClick,
    moveDown: handleConditionDownClick,
  } = useFieldArray(`${ruleName}.conditions`, 'condition')
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
        <TextButton ml="auto" variant="action" onClick={handleAddCondition}>
          <ActionsAdd mr={1} />
          Add Condition
        </TextButton>
      </Flex>
      <Accordion.Provider>
        {conditions.map((condition, conditionIndex) => (
          <FieldsAccordion
            as="h4"
            key={condition.key}
            index={conditionIndex}
            lastIndex={conditions.length - 1}
            header={`Condition #${conditionIndex + 1}`}
            onDelete={handleDeleteCondition}
            onUpClick={handleConditionUpClick}
            onDownClick={handleConditionDownClick}
            defaultOpen={condition.key === newestCondition}
          >
            <Field
              label="Name"
              name={`${condition.name}.variable`}
              options={['A variable', 'Another variable', 'Final variable']}
            />
            <Field
              label="Operator"
              name={`${condition.name}.operator`}
              options={['Greater than', 'Less than', 'Equal to']}
            />
            <Field label="Value" name={`${condition.name}.value`} options={['-1', '0', '1']} />
          </FieldsAccordion>
        ))}
      </Accordion.Provider>
    </>
  )
}

const Actions: RuleSubComponent = ({ ruleName }) => {
  const {
    fields: actions,
    newestKey: newestAction,
    add: handleAddAction,
    remove: handleDeleteAction,
    moveUp: handleActionUpClick,
    moveDown: handleActionDownClick,
  } = useFieldArray(`${ruleName}.actions`, 'action')
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
        <TextButton ml="auto" variant="action" onClick={handleAddAction}>
          <ActionsAdd mr={1} />
          Add Action
        </TextButton>
      </Flex>
      <Accordion.Provider>
        {actions.map((action, actionIndex) => (
          <FieldsAccordion
            as="h4"
            key={action.key}
            index={actionIndex}
            lastIndex={actions.length - 1}
            header={`Action #${actionIndex + 1}`}
            onDelete={handleDeleteAction}
            onUpClick={handleActionUpClick}
            onDownClick={handleActionDownClick}
            defaultOpen={action.key === newestAction}
          >
            <Field
              label="Name"
              name={`${action.name}.action`}
              options={['Do the thing', 'Do another thing', 'Do no things']}
            />
          </FieldsAccordion>
        ))}
      </Accordion.Provider>
    </>
  )
}

export default Rules
