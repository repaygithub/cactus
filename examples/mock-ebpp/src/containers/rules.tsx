import { RouteComponentProps } from '@reach/router'
import { ActionsAdd } from '@repay/cactus-icons'
import { Accordion, Button, Flex, SelectField, Text, TextButton } from '@repay/cactus-web'
import React, { ReactElement, useState } from 'react'
import { Helmet } from 'react-helmet'

import { post } from '../api'
import FieldsAccordion from '../components/FieldsAccordion'

let ruleKeyIndex = 0
let conditionKeyIndex = 0
let actionKeyIndex = 0

type RulesState = {
  key: string
  conditions: { key: string; variable: string; operator: string; value: string }[]
  actions: { key: string; action: string }[]
}[]

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const Rules = (props: RouteComponentProps): ReactElement => {
  const [rules, setRules] = useState<RulesState>([])
  const [newestRule, setNewestRule] = useState<string>('')
  const [newestCondition, setNewestCondition] = useState<string>('')
  const [newestAction, setNewestAction] = useState<string>('')

  const handleAddRule = (): void => {
    const rulesCopy = [...rules]
    const key = `rule-${ruleKeyIndex++}`
    rulesCopy.push({
      key,
      conditions: [],
      actions: [],
    })
    setNewestRule(key)
    setRules(rulesCopy)
  }

  const handleAddCondition = (index: number): void => {
    const rulesCopy = [...rules]
    const rule = rulesCopy[index]
    const key = `condition-${conditionKeyIndex++}`
    if (rule !== undefined) {
      rule.conditions.push({
        key,
        variable: '',
        operator: '',
        value: '',
      })
      setNewestCondition(key)
      setRules(rulesCopy)
    }
  }

  const handleAddAction = (index: number): void => {
    const rulesCopy = [...rules]
    const rule = rulesCopy[index]
    const key = `action-${actionKeyIndex++}`
    if (rule !== undefined) {
      rule.actions.push({ key, action: '' })
      setNewestAction(key)
      setRules(rulesCopy)
    }
  }

  const handleDeleteRule = (index: number): void => {
    const rulesCopy = [...rules]
    rulesCopy.splice(index, 1)
    setRules(rulesCopy)
  }

  const handleDeleteCondition = (ruleIndex: number, conditionIndex: number): void => {
    const rulesCopy = [...rules]
    rulesCopy[ruleIndex].conditions.splice(conditionIndex, 1)
    setRules(rulesCopy)
  }

  const handleDeleteAction = (ruleIndex: number, actionIndex: number): void => {
    const rulesCopy = [...rules]
    rulesCopy[ruleIndex].actions.splice(actionIndex, 1)
    setRules(rulesCopy)
  }

  const handleRuleUpClick = (index: number): void => {
    const rulesCopy = [...rules]
    const temp = rulesCopy[index - 1]
    rulesCopy[index - 1] = rulesCopy[index]
    rulesCopy[index] = temp
    setRules(rulesCopy)
  }

  const handleConditionUpClick = (ruleIndex: number, conditionIndex: number): void => {
    const rulesCopy = [...rules]
    const temp = rulesCopy[ruleIndex].conditions[conditionIndex - 1]
    rulesCopy[ruleIndex].conditions[conditionIndex - 1] =
      rulesCopy[ruleIndex].conditions[conditionIndex]
    rulesCopy[ruleIndex].conditions[conditionIndex] = temp
    setRules(rulesCopy)
  }

  const handleActionUpClick = (ruleIndex: number, actionIndex: number): void => {
    const rulesCopy = [...rules]
    const temp = rulesCopy[ruleIndex].actions[actionIndex - 1]
    rulesCopy[ruleIndex].actions[actionIndex - 1] = rulesCopy[ruleIndex].actions[actionIndex]
    rulesCopy[ruleIndex].actions[actionIndex] = temp
    setRules(rulesCopy)
  }

  const handleRuleDownClick = (index: number): void => {
    const rulesCopy = [...rules]
    const temp = rulesCopy[index + 1]
    rulesCopy[index + 1] = rulesCopy[index]
    rulesCopy[index] = temp
    setRules(rulesCopy)
  }

  const handleConditionDownClick = (ruleIndex: number, conditionIndex: number): void => {
    const rulesCopy = [...rules]
    const temp = rulesCopy[ruleIndex].conditions[conditionIndex + 1]
    rulesCopy[ruleIndex].conditions[conditionIndex + 1] =
      rulesCopy[ruleIndex].conditions[conditionIndex]
    rulesCopy[ruleIndex].conditions[conditionIndex] = temp
    setRules(rulesCopy)
  }

  const handleActionDownClick = (ruleIndex: number, actionIndex: number): void => {
    const rulesCopy = [...rules]
    const temp = rulesCopy[ruleIndex].actions[actionIndex + 1]
    rulesCopy[ruleIndex].actions[actionIndex + 1] = rulesCopy[ruleIndex].actions[actionIndex]
    rulesCopy[ruleIndex].actions[actionIndex] = temp
    setRules(rulesCopy)
  }

  const disableUp = (index: number): boolean => index === 0

  const disableRuleDown = (index: number): boolean => index === rules.length - 1

  const disableConditionDown = (ruleIndex: number, conditionIndex: number): boolean => {
    return conditionIndex === rules[ruleIndex].conditions.length - 1
  }

  const disableActionDown = (ruleIndex: number, actionIndex: number): boolean => {
    return actionIndex === rules[ruleIndex].actions.length - 1
  }

  const handleConditionChange = (
    ruleIndex: number,
    conditionIndex: number,
    key: 'variable' | 'operator' | 'value',
    value: string
  ): void => {
    const rulesCopy = [...rules]
    rulesCopy[ruleIndex].conditions[conditionIndex][key] = value
    setRules(rulesCopy)
  }

  const handleActionChange = (ruleIndex: number, actionIndex: number, value: string): void => {
    const rulesCopy = [...rules]
    rulesCopy[ruleIndex].actions[actionIndex].action = value
    setRules(rulesCopy)
  }

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault()
    post(rules)
    console.log((window as any).apiData)
  }

  return (
    <div>
      <Helmet>
        <title>Rules</title>
      </Helmet>
      <Flex justifyContent="center">
        <Flex width="90%" backgroundColor="base" alignItems="center" paddingLeft="10px">
          <Text color="white" textStyle="h2">
            Rules
          </Text>
        </Flex>

        <Flex borderColor="base" borderWidth="2px" borderStyle="solid" width="90%" px={4} py={4}>
          <TextButton ml="auto" mb={4} variant="action" onClick={handleAddRule}>
            <ActionsAdd mr={1} />
            Add Rule
          </TextButton>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Accordion.Provider maxOpen={1}>
              {rules.map((rule, ruleIndex): ReactElement => {
                return (
                  <FieldsAccordion
                    key={rule.key}
                    index={ruleIndex}
                    header={`Rule #${ruleIndex + 1}`}
                    onDelete={handleDeleteRule}
                    onUpClick={handleRuleUpClick}
                    onDownClick={handleRuleDownClick}
                    disableUp={disableUp}
                    disableDown={disableRuleDown}
                    defaultOpen={rule.key === newestRule}
                  >
                    <Flex
                      alignItems="center"
                      width="100%"
                      borderBottom="1px solid"
                      borderBottomColor="lightContrast"
                      pb={4}
                      mb={4}
                    >
                      <Text as="h4" my={0}>
                        Conditions
                      </Text>
                      <TextButton
                        ml="auto"
                        variant="action"
                        onClick={(): void => handleAddCondition(ruleIndex)}
                      >
                        <ActionsAdd mr={1} />
                        Add Condition
                      </TextButton>
                    </Flex>
                    <Accordion.Provider>
                      {rule.conditions.map((condition, conditionIndex): ReactElement => {
                        return (
                          <FieldsAccordion
                            as="h4"
                            key={condition.key}
                            index={conditionIndex}
                            header={`Condition #${conditionIndex + 1}`}
                            onDelete={(cIndex): void => handleDeleteCondition(ruleIndex, cIndex)}
                            onUpClick={(cIndex): void => handleConditionUpClick(ruleIndex, cIndex)}
                            onDownClick={(cIndex): void =>
                              handleConditionDownClick(ruleIndex, cIndex)
                            }
                            disableUp={disableUp}
                            disableDown={(cIndex): boolean =>
                              disableConditionDown(ruleIndex, cIndex)
                            }
                            defaultOpen={condition.key === newestCondition}
                          >
                            <SelectField
                              label="Name"
                              name="variable"
                              options={['A variable', 'Another variable', 'Final variable']}
                              value={rules[ruleIndex].conditions[conditionIndex].variable}
                              onChange={({ target: { value } }): void =>
                                handleConditionChange(
                                  ruleIndex,
                                  conditionIndex,
                                  'variable',
                                  value as unknown as string
                                )
                              }
                            />
                            <SelectField
                              label="Operator"
                              name="operator"
                              options={['Greater than', 'Less than', 'Equal to']}
                              value={rules[ruleIndex].conditions[conditionIndex].operator}
                              onChange={({ target: { value } }): void =>
                                handleConditionChange(
                                  ruleIndex,
                                  conditionIndex,
                                  'operator',
                                  value as unknown as string
                                )
                              }
                            />
                            <SelectField
                              label="Value"
                              name="value"
                              options={['-1', '0', '1']}
                              value={rules[ruleIndex].conditions[conditionIndex].value}
                              onChange={({ target: { value } }): void =>
                                handleConditionChange(
                                  ruleIndex,
                                  conditionIndex,
                                  'value',
                                  value as unknown as string
                                )
                              }
                            />
                          </FieldsAccordion>
                        )
                      })}
                    </Accordion.Provider>
                    <Flex
                      alignItems="center"
                      width="100%"
                      borderBottom="1px solid"
                      borderBottomColor="lightContrast"
                      pb={4}
                      mb={4}
                      mt={5}
                    >
                      <Text as="h4" my={0}>
                        Actions
                      </Text>
                      <TextButton
                        ml="auto"
                        variant="action"
                        onClick={(): void => handleAddAction(ruleIndex)}
                      >
                        <ActionsAdd mr={1} />
                        Add Action
                      </TextButton>
                    </Flex>
                    <Accordion.Provider>
                      {rule.actions.map(
                        (action, actionIndex): ReactElement => (
                          <FieldsAccordion
                            as="h4"
                            key={action.key}
                            index={actionIndex}
                            header={`Action #${actionIndex + 1}`}
                            onDelete={(aIndex): void => handleDeleteAction(ruleIndex, aIndex)}
                            onUpClick={(aIndex): void => handleActionUpClick(ruleIndex, aIndex)}
                            onDownClick={(aIndex): void => handleActionDownClick(ruleIndex, aIndex)}
                            disableUp={disableUp}
                            disableDown={(aIndex): boolean => disableActionDown(ruleIndex, aIndex)}
                            defaultOpen={action.key === newestAction}
                          >
                            <SelectField
                              label="Name"
                              name="action"
                              options={['Do the thing', 'Do another thing', 'Do no things']}
                              value={rules[ruleIndex].actions[actionIndex].action}
                              onChange={({ target: { value } }): void =>
                                handleActionChange(
                                  ruleIndex,
                                  actionIndex,
                                  value as unknown as string
                                )
                              }
                            />
                          </FieldsAccordion>
                        )
                      )}
                    </Accordion.Provider>
                  </FieldsAccordion>
                )
              })}
            </Accordion.Provider>
            <Flex width="100%" justifyContent="center" mt={4}>
              <Button
                variant="standard"
                my={3}
                mr={3}
                onClick={(): void => {
                  setRules([])
                }}
              >
                Reset
              </Button>
              <Button type="submit" variant="action" my={3} ml={3}>
                Submit
              </Button>
            </Flex>
          </form>
        </Flex>
      </Flex>
    </div>
  )
}

export default Rules
