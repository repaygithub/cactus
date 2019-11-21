import { Accordion, Button, Flex, Text } from '@repay/cactus-web'
import { RouteComponentProps } from '@reach/router'
import Helmet from 'react-helmet'
import React, { useState } from 'react'

interface FaqProps extends RouteComponentProps {}

const initialAccordions = [
  {
    header: 'What is EBPP?',
    body: `Electronic Bill Payment and Presentment (EBPP) is a process, which companies use
    to collect payments via the Internet, direct dial access, Automated Teller Machine
    (ATM), or other electronic method. Electronic Bill Payment and Presentment is a
    core component of many financial institutions' online banking offerings.`,
    id: 'what',
  },
  {
    header: 'Why EBPP?',
    body: `Electronic Bill Payment and Presentment (EBPP) is quick and convienent. The
    customer has the ability to view and pay their bill from anywhere, on an
    electronic device. EBPP also allows for an instant, electronic, transfer of funds.`,
    id: 'why',
  },
  {
    header: 'What is Bill Presentment?',
    body: `Bill presentment is an online system that allows customers to receive and view
    their bill on a computer, and then pay the bill electronically. Users can pay
    their bills immediately and the money is transferred directly from their bank
    account.`,
    id: 'bill',
  },
  {
    header: 'Cat Mojo I Show My Fluffy Belly?',
    body: `Sleep on my human's head behind the couch, yet stand in front of the computer
    screen, and trip on catnip. Make meme, make cute face kitty poochy yet i am the
    best bite nose of your human yet miaow then turn around and show you my bum lick
    sellotape or cat gets stuck in tree firefighters try to get cat down firefighters
    get stuck in tree cat eats firefighters' slippers. Lick sellotape instantly break
    out into full speed gallop across the house for no reason so murder hooman toes so
    lick master's hand at first then bite because im moody dismember a mouse and then
    regurgitate parts of it on the family room floor. Kitty loves pigs eat the
    rubberband sniff sniff yet cats secretly make all the worlds muffins i like frogs
    and 0 gravity adventure always. Cats are fats i like to pets them they like to
    meow back mouse hide when guests come over humans,humans, humans oh how much they
    love us felines we are the center of attention they feed, they clean chase red
    laser dot. Rub against owner because nose is wet run off table persian cat jump
    eat fish. Yowling nonstop the whole night. Nya nya nyan refuse to drink water
    except out of someone's glass yet meow all night having their mate disturbing
    sleeping humans and soft kitty warm kitty little ball of furr so sleep on dog bed,
    force dog to sleep on floor purr when being pet. While happily ignoring when being
    called meow meow mama you are a captive audience while sitting on the toilet, pet
    me. Meow to be let out i vomit in the bed in the middle of the night yet
    ccccccccccccaaaaaaaaaaaaaaatttttttttttttttttssssssssssssssss but lick yarn hanging
    out of own butt i cry and cry and cry unless you pet me, and then maybe i cry just
    for fun. I cry and c`,
    id: 'cats',
  },
  {
    header: 'Office Ipsum?',
    body: `Other agencies charge much lesser I know somebody who can do this for a reasonable
    cost i cant pay you can my website be in english?. Is there a way we can make the
    page feel more introductory without being cheesy give us a complimentary logo
    along with the website make it pop can you make it pop. I cant pay you concept is
    bang on, but can we look at a better execution, so concept is bang on, but can we
    look at a better execution I really think this could go viral, but other agencies
    charge much lesser. I was wondering if my cat could be placed over the logo in the
    flyer could you solutionize that for me I got your invoice...it seems really high,
    why did you charge so much concept is bang on, but can we lo`,
    id: 'office',
  },
]

const Faq = (props: FaqProps) => {
  const [accordions, setAccordions] = useState(initialAccordions)

  const remove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (accordions.length > 0) {
      let accordionsCopy = [...accordions]
      accordionsCopy.shift()
      setAccordions(accordionsCopy)
    }
  }

  const insert = (event: React.MouseEvent<HTMLButtonElement>) => {
    let accordionsCopy = [...accordions]
    let newAccordion = {
      header: 'Lorem Ipsum?',
      body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
      tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
      lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex,
      nec euismod augue aliquam vel.`,
      id: 'new',
    }
    accordionsCopy.unshift(newAccordion)
    setAccordions(accordionsCopy)
  }

  return (
    <div>
      <Helmet>
        <title> FAQ</title>
      </Helmet>

      <Flex justifyContent="center">
        <Flex width="90%" backgroundColor="base" alignItems="center" paddingLeft="10px">
          <Text color="white" textStyle="h2">
            FAQ
          </Text>
        </Flex>

        <Flex
          borderColor="base"
          borderWidth="2px"
          borderStyle="solid"
          width="90%"
          justifyContent="center"
          paddingBottom="16px"
        >
          <Flex padding="16px" width="90%">
            <Accordion.Provider maxOpen={2}>
              {accordions.map((accordion, index) => (
                <Accordion key={index}>
                  <Accordion.Header>{accordion.header}</Accordion.Header>
                  <Accordion.Body>{accordion.body}</Accordion.Body>
                </Accordion>
              ))}
            </Accordion.Provider>
          </Flex>

          <Flex width="90%" justifyContent="space-between">
            <Button variant="action" onClick={insert}>
              Insert Accordion
            </Button>
            <Button variant="danger" onClick={remove}>
              Remove Accordion
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </div>
  )
}

export default Faq
