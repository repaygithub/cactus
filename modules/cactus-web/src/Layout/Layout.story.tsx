import { ActionsGear, DescriptiveClock } from '@repay/cactus-icons'
import React from 'react'
import styled from 'styled-components'

import {
  ActionBar,
  Box,
  BrandBar,
  Breadcrumb,
  Flex,
  Footer,
  Header,
  Layout,
  Link,
  MenuBar,
  MenuButton,
  Modal,
  Select,
  SplitButton,
  TextInputField,
  ToggleField,
  useLayout,
} from '../'
import { actions, ActionWrap, Story, STRING } from '../helpers/storybook'
import { Position } from './grid'

type ClickArg = { onClick: ActionWrap<React.SyntheticEvent | void> }
interface BrandArgs extends ClickArg {
  isProfilePage: boolean
  userMenuTitle: string
}
interface LayoutArgs extends BrandArgs {
  showBrandBar: boolean
  showMenu: boolean
  showActionBar: boolean
  showFooter: boolean
  footerText: string
}

const LOGO =
  'https://repay-merchant-resources.s3.amazonaws.com/staging/24bd1970-a677-4ca7-a4d2-e328ddd4691b/repay_logo_new.jpg'

export default {
  title: 'Layout',
  component: Layout,
  argTypes: actions({ name: 'onClick', wrapper: true }),
} as const

const StoryBrandBar = ({ onClick, isProfilePage, userMenuTitle }: BrandArgs) => (
  <BrandBar logo={LOGO}>
    <BrandBar.UserMenu isProfilePage={isProfilePage} label={userMenuTitle}>
      <BrandBar.UserMenuItem onSelect={onClick('Settings')}>Settings</BrandBar.UserMenuItem>
      <BrandBar.UserMenuItem onSelect={onClick('Logout')}>Logout</BrandBar.UserMenuItem>
    </BrandBar.UserMenu>
  </BrandBar>
)

const StoryMenuBar = ({ onClick }: ClickArg) => (
  <MenuBar>
    <MenuBar.Item onClick={onClick('Tuesday')}>The Other Day</MenuBar.Item>
    <MenuBar.Item onClick={onClick('Mill')}>I saw</MenuBar.Item>
    <MenuBar.Item onClick={onClick('Growl')}>A Bear</MenuBar.Item>
    <MenuBar.Item onClick={onClick('And Powerful')}>A Great</MenuBar.Item>
    <MenuBar.Item onClick={onClick('Iorek Byrnison')}>Big Bear</MenuBar.Item>
    <MenuBar.Item onClick={onClick('Dao de jing')}>A Way</MenuBar.Item>
    <MenuBar.Item onClick={onClick('Stars')}>Up There</MenuBar.Item>
    <MenuBar.Item onClick={onClick('Over There')}>He Looked</MenuBar.Item>
    <MenuBar.Item onClick={onClick('Myself And I')}>At Me</MenuBar.Item>
    <MenuBar.Item onClick={onClick('In a Mirror')}>I Looked</MenuBar.Item>
    <MenuBar.Item onClick={onClick('Reflected')}>At Him</MenuBar.Item>
    <MenuBar.Item onClick={onClick('Mouthful')}>He Sized Me Up</MenuBar.Item>
    <MenuBar.Item onClick={onClick('Scary')}>I Sized Up Him</MenuBar.Item>
    <MenuBar.List title="Interlude: About Bears">
      <MenuBar.List title="Kuma">
        <MenuBar.Item>Ichi</MenuBar.Item>
        <MenuBar.Item>Ni</MenuBar.Item>
        <MenuBar.Item>San</MenuBar.Item>
        <MenuBar.Item>Shi</MenuBar.Item>
        <MenuBar.Item>Go</MenuBar.Item>
        <MenuBar.Item>Roku</MenuBar.Item>
        <MenuBar.Item>Shichi</MenuBar.Item>
        <MenuBar.Item>Haku</MenuBar.Item>
        <MenuBar.Item>Kyuu</MenuBar.Item>
        <MenuBar.Item>Juu</MenuBar.Item>
        <MenuBar.Item>Juu-Ichi</MenuBar.Item>
        <MenuBar.Item>Juu-Ni</MenuBar.Item>
      </MenuBar.List>
      <MenuBar.Item onClick={onClick('RAWR')}>Brown Bear</MenuBar.Item>
      <MenuBar.Item onClick={onClick('GRR')}>Polar Bear</MenuBar.Item>
      <MenuBar.Item onClick={onClick('ZZZZ')}>Giant Panda</MenuBar.Item>
      <MenuBar.Item onClick={onClick('SIZZLE')}>Sun Bear</MenuBar.Item>
    </MenuBar.List>
    <MenuBar.Item onClick={onClick('Yo Dude')}>He Said to Me</MenuBar.Item>
    <MenuBar.Item onClick={onClick('AHHHH')}>Why Don't You Run</MenuBar.Item>
    <MenuBar.Item onClick={onClick('Nai wa')}>I See You Ain't</MenuBar.Item>
    <MenuBar.Item onClick={onClick('Boomstick')}>Got Any Gun</MenuBar.Item>
    <MenuBar.Item onClick={onClick('WHOOSH')}>And So I Ran</MenuBar.Item>
    <MenuBar.Item onClick={onClick('Escape')}>Away From There</MenuBar.Item>
    <MenuBar.Item onClick={onClick('No, Left')}>And Right</MenuBar.Item>
    <MenuBar.Item onClick={onClick('Jump Scare')}>Behind Me</MenuBar.Item>
    <MenuBar.Item onClick={onClick('Hunger')}>Was That Bear</MenuBar.Item>
  </MenuBar>
)

const StoryActionBar = ({ onClick }: ClickArg) => (
  <ActionBar>
    <ActionBar.Item
      id="whattime"
      aria-label="Current Time"
      icon={<DescriptiveClock />}
      onClick={() => alert(`It is now ${new Date()}.`)}
    />
    <ActionBar.Panel id="settings" icon={<ActionsGear />} popupType="dialog" aria-label="Settings">
      <Flex flexDirection="column" flexWrap="nowrap">
        <SplitButton
          mb={3}
          onSelectMainAction={onClick('Main Action')}
          mainActionLabel="Main Action"
        >
          <SplitButton.Action onSelect={onClick('SplitButton One')}>Action One</SplitButton.Action>
          <SplitButton.Action onSelect={onClick('SplitButton Two')}>Action Two</SplitButton.Action>
        </SplitButton>
        <Select
          id="select-number"
          name="number"
          mb={3}
          options={['one', 'two', 'four', 'hundred', 'seventy-six', 'zero']}
        />
        <MenuButton mb={3} label="Z-index Test">
          <MenuButton.Item onSelect={onClick('MenuButton One')}>Action One</MenuButton.Item>
          <MenuButton.Item onSelect={onClick('MenuButton Two')}>Action Two</MenuButton.Item>
          <MenuButton.Item onSelect={onClick('MenuButton Three')}>Action Three</MenuButton.Item>
        </MenuButton>
        <TextInputField label="Some Setting" name="setting" />
      </Flex>
    </ActionBar.Panel>
  </ActionBar>
)

const StoryFooter = ({ text }: { text: string }) => (
  <Footer logo={LOGO}>
    <em>{text + ' '}</em>
    <a href="#">The Link To Nowhere</a>
    {' | '}
    <a href="https://google.com">The Giant</a>
  </Footer>
)

export const BasicUsage: Story<LayoutArgs, { menuVariant: 'light' | 'dark' }> = ({
  showBrandBar,
  showMenu,
  showActionBar,
  showFooter,
  menuVariant,
  footerText,
  onClick,
  ...bbArgs
}) => {
  const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false)

  return (
    <Layout>
      {showBrandBar && <StoryBrandBar {...bbArgs} onClick={onClick} />}
      {showMenu && (
        <MenuBar variant={menuVariant}>
          <MenuBar.Item onClick={onClick('Tuesday')}>The Other Day</MenuBar.Item>
          <MenuBar.Item onClick={onClick('Mill')}>I saw</MenuBar.Item>
          <MenuBar.List title="Interlude: About Bears">
            <MenuBar.Item onClick={onClick('RAWR')}>Brown Bear</MenuBar.Item>
            <MenuBar.Item onClick={onClick('GRR')}>Polar Bear</MenuBar.Item>
            <MenuBar.List title="Long Bears">
              <MenuBar.Item>A very long label about bears is wider than its parent</MenuBar.Item>
            </MenuBar.List>
          </MenuBar.List>
        </MenuBar>
      )}
      {showActionBar && <StoryActionBar onClick={onClick} />}
      <Layout.Content>
        <Header bgColor={menuVariant === 'dark' ? 'lightContrast' : 'white'}>
          <Header.BreadcrumbRow>
            <Breadcrumb>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((i) => (
                <Breadcrumb.Item href="/" key={i}>{`label ${i}`}</Breadcrumb.Item>
              ))}
              <Breadcrumb.Item as={Link} href="/">
                Make a Payment
              </Breadcrumb.Item>
            </Breadcrumb>
          </Header.BreadcrumbRow>
          <Header.Title>Latin Or Something</Header.Title>
        </Header>
        <TextInputField name="foo" label="Foo" m={0} />
        <ToggleField
          ml="150px"
          name="modalToggle"
          label="Show Me The Modal"
          checked={modalIsOpen}
          onChange={(e) => setModalIsOpen(e.target.checked)}
        />
        <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
          I am the very model of a modern major modal.
          <Select mt={3} name="modalSelect" id="modalSelect" options={['True', 'False']} />
        </Modal>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas augue ex, dignissim sed
          fringilla nec, tincidunt fermentum libero. Mauris ut enim ornare, euismod nibh at,
          ultricies massa. Ut erat diam, sodales non porta eu, dictum ut neque. Curabitur non justo
          sed ligula ultricies dapibus. Nulla quis ante nisi. Praesent fermentum iaculis convallis.
          Mauris ac quam eu turpis volutpat viverra nec ac ligula. Vivamus efficitur dolor quis
          magna suscipit, eu congue ipsum posuere. Vestibulum ultrices, diam nec rhoncus porttitor,
          neque nibh euismod mauris, quis posuere mi turpis ac lorem. Ut sodales sodales elit a
          semper.
        </p>
        <p>
          Mauris eu felis fringilla tortor scelerisque tincidunt et quis risus. Proin dui arcu,
          tincidunt nec rhoncus eu, blandit ut odio. Donec ac tristique felis. Morbi vel urna
          commodo, efficitur orci in, condimentum augue. Morbi neque felis, consequat sit amet mi
          eget, imperdiet consectetur augue. Sed dignissim congue ex at vestibulum. Etiam rutrum,
          mauris rutrum maximus congue, lectus sem molestie est, eget gravida orci ligula tempus
          dolor.
        </p>
        <p>
          Curabitur in justo massa. Pellentesque vitae tortor ligula. Morbi vulputate tortor ut
          dapibus imperdiet. In hac habitasse platea dictumst. Vivamus ornare auctor est, vel
          aliquet velit scelerisque ac. Mauris sit amet magna vitae dolor volutpat mattis ut et
          nibh. Donec eu suscipit turpis. Aliquam suscipit massa sed turpis vestibulum faucibus.
          Maecenas in lectus quis justo auctor euismod vel ut orci. Nunc cursus sit amet quam non
          dignissim. Nullam in egestas lectus, ut porta leo. Suspendisse sit amet nisi magna.
          Vestibulum eget porttitor orci. Duis nec elit posuere, condimentum orci in, eleifend quam.
          Morbi eget tortor a orci finibus vulputate eu id felis.
        </p>
      </Layout.Content>
      {showFooter && <StoryFooter text={footerText} />}
    </Layout>
  )
}
BasicUsage.argTypes = { menuVariant: { options: ['light', 'dark'] } }
BasicUsage.args = {
  showBrandBar: true,
  showMenu: true,
  showActionBar: true,
  showFooter: true,
  isProfilePage: false,
  userMenuTitle: 'Hershell Jewess',
  footerText: 'How will you REPAY us?',
}
BasicUsage.parameters = {
  cactus: { overrides: { display: 'block', position: 'static', width: '100%', height: '100%' } },
}

const SuperWideHeader = styled(Header)`
  min-width: 2000px;
`

export const ShortContent: Story<LayoutArgs, { showMainScrollbar: boolean }> = ({
  showBrandBar,
  showMenu,
  showActionBar,
  showMainScrollbar,
  showFooter,
  footerText,
  onClick,
  ...bbArgs
}): React.ReactElement => {
  return (
    <Layout>
      {showBrandBar && <StoryBrandBar {...bbArgs} onClick={onClick} />}
      {showMenu && <StoryMenuBar onClick={onClick} />}
      {showActionBar && <StoryActionBar onClick={onClick} />}
      <Layout.Content overflowX={showMainScrollbar ? 'auto' : undefined}>
        <SuperWideHeader>
          <SuperWideHeader.BreadcrumbRow>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Test</Breadcrumb.Item>
              <Breadcrumb.Active>Hi</Breadcrumb.Active>
            </Breadcrumb>
          </SuperWideHeader.BreadcrumbRow>
          <SuperWideHeader.Title>Latin Or Something</SuperWideHeader.Title>
        </SuperWideHeader>
      </Layout.Content>
      {showFooter && <StoryFooter text={footerText} />}
    </Layout>
  )
}
ShortContent.args = {
  ...BasicUsage.args,
  showMainScrollbar: true,
}
ShortContent.parameters = {
  cactus: {
    overrides: { display: 'block', position: 'static', width: '100%', height: '100%' },
  },
}

interface GridProps {
  role: string
  order?: number
  bg: string
  style?: React.HTMLAttributes<any>['style']
}
const SIDEWAYS = { writingMode: 'vertical-rl' } as const
const GridItem = ({ role, order, bg, style, ...position }: GridProps & Position) => {
  const layoutClass = useLayout(role, position, order)
  const color = `hsl(${bg}, 30%, 70%)`
  return (
    <Box backgroundColor={color} className={layoutClass} p={2}>
      <span style={style}>{role}</span>
    </Box>
  )
}

export const CustomGrid: Story<{ height: string }> = ({ height }) => (
  <Layout>
    <GridItem role="header1" bg="0" grid="header" col={3} colEnd={-2} />
    <GridItem role="header2" bg="40" grid="header" height={50} col="main" />
    <GridItem role="upperLeft" bg="80" col={1} colSpan={2} row={1} rowSpan={2} />
    <GridItem role="upperRight" bg="120" row={1} col={-2} colEnd={-1} />
    <GridItem role="main" bg="160" width="1fr" height={height || '2fr'} />
    <GridItem role="left1" bg="200" grid="left" width={50} rowEnd={-1} />
    <GridItem role="left2" bg="240" grid="left" width={50} />
    <GridItem role="right" bg="280" grid="right" style={SIDEWAYS} />
    <GridItem role="footer" bg="320" grid="footer" height="minmax(50px, 1fr)" col="left2" />
    <GridItem role="fixed-bottom1" bg="20" fixed="bottom" size={28} order={1} />
    <GridItem role="fixed-right" bg="160" fixed="right" size={40} order={2} style={SIDEWAYS} />
    <GridItem role="fixed-bottom2" bg="40" fixed="bottom" size={28} order={3} />
  </Layout>
)
CustomGrid.argTypes = { height: STRING }
