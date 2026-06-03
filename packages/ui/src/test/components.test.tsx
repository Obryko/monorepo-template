import { render } from '@testing-library/react'
import { describe, expect, it } from '@rstest/core'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  Input,
  Label,
  Separator,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '../index.ts'

describe('UI components smoke tests', () => {
  it('Button renders', () => {
    const { container } = render(<Button>Click me</Button>)
    expect(container.firstChild).toBeTruthy()
  })

  it('Input renders', () => {
    const { container } = render(<Input placeholder="test" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('Label renders', () => {
    const { container } = render(<Label>Label</Label>)
    expect(container.firstChild).toBeTruthy()
  })

  it('Textarea renders', () => {
    const { container } = render(<Textarea />)
    expect(container.firstChild).toBeTruthy()
  })

  it('Checkbox renders', () => {
    const { container } = render(<Checkbox />)
    expect(container.firstChild).toBeTruthy()
  })

  it('Card renders', () => {
    const { container } = render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>,
    )
    expect(container.firstChild).toBeTruthy()
  })

  it('Badge renders', () => {
    const { container } = render(<Badge>New</Badge>)
    expect(container.firstChild).toBeTruthy()
  })

  it('Alert renders', () => {
    const { container } = render(<Alert>Alert content</Alert>)
    expect(container.firstChild).toBeTruthy()
  })

  it('Separator renders', () => {
    const { container } = render(<Separator />)
    expect(container.firstChild).toBeTruthy()
  })

  it('Skeleton renders', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toBeTruthy()
  })

  it('Tabs renders', () => {
    const { container } = render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
      </Tabs>,
    )
    expect(container.firstChild).toBeTruthy()
  })
})
