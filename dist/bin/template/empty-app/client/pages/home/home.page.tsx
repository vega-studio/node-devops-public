import React from "react";
import { classnames } from "../../../../util/classnames.js";
import { cva, VariantProps } from "../../../../util/cva.js";
import { observer } from "mobx-react";
import "./home.page.scss";

/**
 * Rendering variants of this page
 */
export const HomePageCva = cva("HomePage", {
  variants: {
    mode: {},
  },
  defaultVariants: { mode: undefined },
});

/**
 * Props available to this page
 */
export interface IHomePage extends VariantProps<typeof HomePageCva.variants> {
  /** Provides a custom class name to the container of this page */
  className?: string;
  /** Props to apply directly to the container div of this page */
  containerProps?: React.HTMLProps<HTMLDivElement>;
}

/**
 * Default System Home page for the app. Modify the routes in PageManager to
 * change this as needed.
 *
 * Use the forwardRef pattern to reference the top level DOM element to tie this
 * into the page animation system
 */
export const HomePage = observer(
  React.forwardRef<HTMLDivElement, IHomePage>((props: IHomePage, ref) => {
    const { className, containerProps, mode } = props;

    return (
      <div
        ref={ref}
        className={classnames(HomePageCva.variants({ mode }), className)}
        {...containerProps}
      >
        Home Page
      </div>
    );
  })
);
