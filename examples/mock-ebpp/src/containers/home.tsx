import { RouteComponentProps } from '@reach/router'
import { Card, Flex, Grid, Text } from '@repay/cactus-web'
import React from 'react'
import { Helmet } from 'react-helmet'

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const Home = (props: RouteComponentProps): React.ReactElement => {
  return (
    <div>
      <Helmet>
        <title> Home</title>
      </Helmet>

      <Flex justifyContent="center">
        <Flex width="90%" backgroundColor="base" alignItems="center" paddingLeft="10px">
          <Text color="white" textStyle="h2">
            Home
          </Text>
        </Flex>

        <Flex
          borderColor="base"
          borderWidth="2px"
          borderStyle="solid"
          width="90%"
          justifyContent="center"
        >
          <Grid justify="center" mb={4}>
            <Grid.Item tiny={12}>
              <h3> Welcome to The Example Testing App 😃</h3>
            </Grid.Item>

            <Grid.Item tiny={12}>
              <h5> Developed by Dhalton Huber and Victoria Vyverman</h5>
            </Grid.Item>
            <Grid.Item tiny={1} medium={2} />
            <Grid.Item tiny={12} medium={4}>
              <Card>
                <h2 style={{ margin: 0 }}> Dhalton Huber </h2>
                <h4 style={{ margin: '0 0 8px', fontWeight: 400, fontSize: '16px' }}>
                  Full Stack Developer
                </h4>
              </Card>
            </Grid.Item>

            <Grid.Item tiny={12} medium={4}>
              <Card>
                <h2 style={{ margin: 0 }}> Victoria Vyverman </h2>
                <h4 style={{ margin: '0 0 8px', fontWeight: 400, fontSize: '16px' }}>
                  Full Stack Developer Intern
                </h4>
              </Card>
            </Grid.Item>

            <Grid.Item tiny={1} medium={2} />
          </Grid>
        </Flex>
      </Flex>
    </div>
  )
}

export default Home
