import { ActionsGear, DescriptiveClock } from '@repay/cactus-icons'
import { boolean, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'
import styled from 'styled-components'

import {
  ActionBar,
  BrandBar,
  Breadcrumb,
  Flex,
  Footer,
  Header,
  Layout,
  MenuBar,
  MenuButton,
  Modal,
  Select,
  SplitButton,
  TextInputField,
  ToggleField,
} from '../'

function action(msg: string) {
  return () => console.log('ITEM CLICKED:', msg)
}

const LOGO =
  'https://repay-merchant-resources.s3.amazonaws.com/staging/24bd1970-a677-4ca7-a4d2-e328ddd4691b/repay_logo_new.jpg'

export default {
  title: 'Layout',
  component: Layout,
} as Meta

const StoryBrandBar = () => (
  <BrandBar logo={LOGO}>
    <BrandBar.UserMenu
      isProfilePage={boolean('On profile page?', false)}
      label={text('Menu Title', 'Hershell Jewess')}
    >
      <BrandBar.UserMenuItem onSelect={action('Settings')}>Settings</BrandBar.UserMenuItem>
      <BrandBar.UserMenuItem onSelect={action('Logout')}>Logout</BrandBar.UserMenuItem>
    </BrandBar.UserMenu>
  </BrandBar>
)

const StoryMenuBar = () => (
  <MenuBar>
    <MenuBar.Item onClick={action('Tuesday')}>The Other Day</MenuBar.Item>
    <MenuBar.Item onClick={action('Mill')}>I saw</MenuBar.Item>
    <MenuBar.Item onClick={action('Growl')}>A Bear</MenuBar.Item>
    <MenuBar.Item onClick={action('And Powerful')}>A Great</MenuBar.Item>
    <MenuBar.Item onClick={action('Iorek Byrnison')}>Big Bear</MenuBar.Item>
    <MenuBar.Item onClick={action('Dao de jing')}>A Way</MenuBar.Item>
    <MenuBar.Item onClick={action('Stars')}>Up There</MenuBar.Item>
    <MenuBar.Item onClick={action('Over There')}>He Looked</MenuBar.Item>
    <MenuBar.Item onClick={action('Myself And I')}>At Me</MenuBar.Item>
    <MenuBar.Item onClick={action('In a Mirror')}>I Looked</MenuBar.Item>
    <MenuBar.Item onClick={action('Reflected')}>At Him</MenuBar.Item>
    <MenuBar.Item onClick={action('Mouthful')}>He Sized Me Up</MenuBar.Item>
    <MenuBar.Item onClick={action('Scary')}>I Sized Up Him</MenuBar.Item>
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
      <MenuBar.Item onClick={action('RAWR')}>Brown Bear</MenuBar.Item>
      <MenuBar.Item onClick={action('GRR')}>Polar Bear</MenuBar.Item>
      <MenuBar.Item onClick={action('ZZZZ')}>Giant Panda</MenuBar.Item>
      <MenuBar.Item onClick={action('SIZZLE')}>Sun Bear</MenuBar.Item>
    </MenuBar.List>
    <MenuBar.Item onClick={action('Yo Dude')}>He Said to Me</MenuBar.Item>
    <MenuBar.Item onClick={action('AHHHH')}>Why Don't You Run</MenuBar.Item>
    <MenuBar.Item onClick={action('Nai wa')}>I See You Ain't</MenuBar.Item>
    <MenuBar.Item onClick={action('Boomstick')}>Got Any Gun</MenuBar.Item>
    <MenuBar.Item onClick={action('WHOOSH')}>And So I Ran</MenuBar.Item>
    <MenuBar.Item onClick={action('Escape')}>Away From There</MenuBar.Item>
    <MenuBar.Item onClick={action('No, Left')}>And Right</MenuBar.Item>
    <MenuBar.Item onClick={action('Jump Scare')}>Behind Me</MenuBar.Item>
    <MenuBar.Item onClick={action('Hunger')}>Was That Bear</MenuBar.Item>
  </MenuBar>
)

const StoryActionBar = () => (
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
          onSelectMainAction={action('Main Action')}
          mainActionLabel="Main Action"
        >
          <SplitButton.Action onSelect={action('SplitButton One')}>Action One</SplitButton.Action>
          <SplitButton.Action onSelect={action('SplitButton Two')}>Action Two</SplitButton.Action>
        </SplitButton>
        <Select
          id="select-number"
          name="number"
          mb={3}
          options={['one', 'two', 'four', 'hundred', 'seventy-six', 'zero']}
        />
        <MenuButton mb={3} label="Z-index Test">
          <MenuButton.Item onSelect={action('MenuButton One')}>Action One</MenuButton.Item>
          <MenuButton.Item onSelect={action('MenuButton Two')}>Action Two</MenuButton.Item>
          <MenuButton.Item onSelect={action('MenuButton Three')}>Action Three</MenuButton.Item>
        </MenuButton>
        <TextInputField label="Some Setting" name="setting" />
      </Flex>
    </ActionBar.Panel>
  </ActionBar>
)

const StoryFooter = () => (
  <Footer logo={LOGO}>
    <em>{text('Footer', 'How will you REPAY us?')}</em>
    <Footer.Link to="#">The Link To Nowhere</Footer.Link>
    <Footer.Link to="https://google.com">The Giant</Footer.Link>
  </Footer>
)

export const BasicUsage = (): React.ReactElement => {
  const hasBrand = boolean('Show Brand Bar', true)
  const hasMenu = boolean('Show Menu', true)
  const hasActions = boolean('Show Action Bar', true)
  const hasFooter = boolean('Show Footer', true)
  const useDarkNav = boolean('Dark Navigation', false)
  const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false)

  return (
    <Layout>
      {hasBrand && <StoryBrandBar />}
      {hasMenu && (
        <MenuBar variant={useDarkNav ? 'dark' : 'light'}>
          <MenuBar.Item onClick={action('Tuesday')}>The Other Day</MenuBar.Item>
          <MenuBar.Item onClick={action('Mill')}>I saw</MenuBar.Item>
          <MenuBar.List title="Interlude: About Bears">
            <MenuBar.Item onClick={action('RAWR')}>Brown Bear</MenuBar.Item>
            <MenuBar.Item onClick={action('GRR')}>Polar Bear</MenuBar.Item>
            <MenuBar.List title="Long Bears">
              <MenuBar.Item>A very long label about bears is wider than its parent</MenuBar.Item>
            </MenuBar.List>
          </MenuBar.List>
        </MenuBar>
      )}
      {hasActions && <StoryActionBar />}
      <Layout.Content>
        <Header bgColor={useDarkNav ? 'lightContrast' : 'white'}>
          <Header.Title>Latin Or Something</Header.Title>
        </Header>
        <TextInputField name="foo" label="Foo" />
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
      {hasFooter && <StoryFooter />}
    </Layout>
  )
}

BasicUsage.parameters = {
  cactus: { overrides: { display: 'block', position: 'static', width: '100%', height: '100%' } },
}

const SuperWideHeader = styled(Header)`
  min-width: 2000px;
`

export const ShortContent = (): React.ReactElement => {
  const hasBrand = boolean('Show Brand Bar', true)
  const hasMenu = boolean('Show Menu', true)
  const hasActions = boolean('Show Action Bar', false)
  const hasFooter = boolean('Show Footer', true)
  const overflow = boolean('Main Scrollbar', true)

  return (
    <Layout>
      {hasBrand && <StoryBrandBar />}
      {hasMenu && <StoryMenuBar />}
      {hasActions && <StoryActionBar />}
      <Layout.Content overflowX={overflow ? 'auto' : undefined}>
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
      {hasFooter && <StoryFooter />}
    </Layout>
  )
}

ShortContent.parameters = {
  cactus: {
    overrides: { display: 'block', position: 'static', width: '100%', height: '100%' },
  },
}
