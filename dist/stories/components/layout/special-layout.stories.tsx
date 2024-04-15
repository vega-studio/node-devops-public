import React from "react";
import { StoryFn } from "@storybook/react";

import { cvaOptionsToStorybook } from "../../../../util/cva.js";
import { SpecialLayout, SpecialLayoutCva } from "../../../components/index.js";
import { SpecialLayoutProps } from "../../data/layout/special-layout-props.js";

export default {
  title: "Devops/Layout/SpecialLayout",
  component: SpecialLayout,
  args: {},
  argTypes: {
    ...cvaOptionsToStorybook(SpecialLayoutCva),
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    containerProps: { table: { disable: true } },
  },
};

const Template = (children?: any) => (args: any) => (
  <SpecialLayout {...args}>{children}</SpecialLayout>
);

export const Basic: StoryFn = Template().bind({});
Basic.args = SpecialLayoutProps();
