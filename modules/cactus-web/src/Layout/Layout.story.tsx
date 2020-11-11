import { ActionsGear, DescriptiveClock } from '@repay/cactus-icons'
import { boolean, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import ActionBar from '../ActionBar/ActionBar'
import BrandBar from '../BrandBar/BrandBar'
import Flex from '../Flex/Flex'
import Footer from '../Footer/Footer'
import MenuBar from '../MenuBar/MenuBar'
import MenuButton from '../MenuButton/MenuButton'
import SplitButton from '../SplitButton/SplitButton'
import TextInputField from '../TextInputField/TextInputField'
import Layout from './Layout'

function action(msg: string) {
  return () => console.log('ITEM CLICKED:', msg)
}

const LOGO =
  'https://repay-merchant-resources.s3.amazonaws.com/staging/24bd1970-a677-4ca7-a4d2-e328ddd4691b/repay_logo_new.jpg'

export default {
  title: 'Layout',
  component: Layout,
} as Meta

export const BasicUsage = (): React.ReactElement => {
  const hasBrand = boolean('Show Brand Bar', true)
  const hasMenu = boolean('Show Menu', true)
  const hasActions = boolean('Show Action Bar', true)
  const hasFooter = boolean('Show Footer', true)
  const footerText = text('Footer', 'How will you REPAY us?')

  return (
    <Layout>
      {hasBrand && (
        <BrandBar
          isProfilePage={boolean('On profile page?', false)}
          userMenuText={text('Menu Title', 'Hershell Jewess')}
          logo={LOGO}
        >
          <BrandBar.UserMenuItem onSelect={action('Settings')}>Settings</BrandBar.UserMenuItem>
          <BrandBar.UserMenuItem onSelect={action('Logout')}>Logout</BrandBar.UserMenuItem>
        </BrandBar>
      )}
      {hasMenu && (
        <MenuBar>
          <MenuBar.Item onClick={action('Tuesday')}>The Other Day</MenuBar.Item>
          <MenuBar.Item onClick={action('Mill')}>I saw</MenuBar.Item>
          <MenuBar.List title="A Bear">
            <MenuBar.Item onClick={action('RAWR')}>Brown Bear</MenuBar.Item>
            <MenuBar.Item onClick={action('GRR')}>Polar Bear</MenuBar.Item>
            <MenuBar.Item onClick={action('ZZZZ')}>Giant Panda</MenuBar.Item>
            <MenuBar.Item onClick={action('SIZZLE')}>Sun Bear</MenuBar.Item>
          </MenuBar.List>
          <MenuBar.Item onClick={action('And Powerful')}>A Great</MenuBar.Item>
          <MenuBar.Item onClick={action('Iorek Byrnison')}>Big Bear</MenuBar.Item>
          <MenuBar.Item onClick={action('Dao de jing')}>A Way</MenuBar.Item>
          <MenuBar.Item onClick={action('Stars')}>Up There</MenuBar.Item>
        </MenuBar>
      )}
      {hasActions && (
        <ActionBar>
          <ActionBar.Item
            id="whattime"
            icon={<DescriptiveClock />}
            onClick={() => alert(`It is now ${new Date()}.`)}
          />
          <ActionBar.Panel
            id="settings"
            icon={<ActionsGear />}
            popupType="dialog"
            aria-label="Settings"
          >
            <Flex flexDirection="column" flexWrap="nowrap">
              <SplitButton
                mb={3}
                onSelectMainAction={action('Main Action')}
                mainActionLabel="Main Action"
              >
                <SplitButton.Action onSelect={action('SplitButton One')}>
                  Action One
                </SplitButton.Action>
                <SplitButton.Action onSelect={action('SplitButton Two')}>
                  Action Two
                </SplitButton.Action>
              </SplitButton>
              <MenuButton mb={3} label="Z-index Test">
                <MenuButton.Item onSelect={action('MenuButton One')}>Action One</MenuButton.Item>
                <MenuButton.Item onSelect={action('MenuButton Two')}>Action Two</MenuButton.Item>
                <MenuButton.Item onSelect={action('MenuButton Three')}>
                  Action Three
                </MenuButton.Item>
              </MenuButton>
              <TextInputField label="Some Setting" name="setting" />
            </Flex>
          </ActionBar.Panel>
        </ActionBar>
      )}
      <Layout.Content>
        <h1>Latin Or Something</h1>
        <TextInputField name="foo" label="Foo" />
        <TextInputField name="bar" label="Bar" />
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
      {hasFooter && (
        <Footer logo={LOGO}>
          <em>{footerText}</em>
          <Footer.Link to="#">The Link To Nowhere</Footer.Link>
          <Footer.Link to="https://google.com">The Giant</Footer.Link>
        </Footer>
      )}
    </Layout>
  )
}

BasicUsage.parameters = {
  cactus: { overrides: { display: 'block', position: 'static', width: '100%', height: '100%' } },
}
