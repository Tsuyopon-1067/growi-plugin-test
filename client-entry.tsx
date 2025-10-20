import { ReactElement, TableHTMLAttributes } from "react";
import { HogehogeComponent } from "./src/HogehogeComponent";

declare const growiFacade: any;

interface CustomTableProps extends TableHTMLAttributes<HTMLTableElement> {
  className?: string;
  children?: React.ReactNode;
}

type TableComponent = (props: CustomTableProps) => ReactElement;

const activate = (): void => {
  console.log("Plugin activated!"); // ここが呼び出されているか確認
  if (growiFacade == null || growiFacade.markdownRenderer == null) {
    return;
  }

  const { optionsGenerators } = growiFacade.markdownRenderer;
  const originalCustomViewOptions = optionsGenerators.customGenerateViewOptions;

  optionsGenerators.customGenerateViewOptions = (...args: any[]): any => {
    const options = originalCustomViewOptions
      ? originalCustomViewOptions(...args)
      : optionsGenerators.generateViewOptions(...args);

    // 元のtableコンポーネントを保存
    const OriginalTableComponent: TableComponent = options.components.table;

    // 新しいtableコンポーネントで上書き
    options.components.table = (props: CustomTableProps): ReactElement => {
      // 特定のクラスがあるかチェック
      if (props.className?.includes("my-custom-table")) {
        console.log("mycoustom table!!!");
        return <HogehogeComponent {...props} />;
      }

      // それ以外は元のコンポーネントをそのまま使用
      console.log("mycoustom table janaiyo");
      return <OriginalTableComponent {...props} />;
    };

    return options;
  };
};

const deactivate = (): void => {};

// register activate
if ((window as any).pluginActivators == null) {
  (window as any).pluginActivators = {};
}
(window as any).pluginActivators["growi-plugin-hogehoge"] = {
  activate,
  deactivate,
};
