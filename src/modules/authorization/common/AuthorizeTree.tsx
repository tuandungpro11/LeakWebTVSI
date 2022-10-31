import { Fragment, useMemo, useState, useEffect } from "react"
import "antd/dist/antd.css";
import "react-contexify/dist/ReactContexify.min.css";
import "@styles/react/libs/context-menu/context-menu.scss";
import React from "react";
import { CardTitle } from "reactstrap";
import { Tree } from "antd";
import Search from "antd/lib/input/Search";
import { TreeProps } from "../type";
import { Key } from "antd/lib/table/interface";

interface Props {
    flattenDataList: TreeProps[]
    data: TreeProps[]
    handleSelectItem?: (item: number) => void
}

const AuthorizeTree: React.FC<Props> = ({flattenDataList, data, handleSelectItem}) => {
    
    const [searchValue, setSearchValue] = useState("");
    const [expandedKeys, setExpandedKeys] = useState<(Key)[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);

    const onExpand = (expandedKeys: Key[]) => {
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };
    const getParentKey = (key: number, tree: TreeProps[]): number => {
        let parentKey = 0;

        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some((item: TreeProps) => item.key === key)) {
                    return node.key;
                }
                else if (getParentKey(key, node.children)) {
                    parentKey = getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    }

    const onChange = (e: { target: { value: string; }; }) => {
        const { value } = e.target;
        if(value.trim().length === 0) {
            setExpandedKeys([]);
            setSearchValue(value);
            setAutoExpandParent(false);    
            return
        }
        let newExpandedKeys: Key[] = []
        flattenDataList
            .map((item) => {
                if ((item.title as string).toLowerCase().indexOf(value.toLowerCase()) > -1) {
                    newExpandedKeys.push(getParentKey(item.key, data));
                }
            })
        newExpandedKeys.filter((item, i, self) => item && self.indexOf(item) === i)
        setExpandedKeys(newExpandedKeys);
        setSearchValue(value);
        setAutoExpandParent(true);
    };

    const treeData = useMemo(() => {
        const loop = (data: TreeProps[]) : TreeProps[] =>
            data.map((item) => {
                const strTitle = item.title as string;
                const index = strTitle.indexOf(searchValue);
                const beforeStr = strTitle.substring(0, index);
                const afterStr = strTitle.slice(index + searchValue.length);
                const title =
                    index > -1 ? (
                    <span>
                        {beforeStr}
                        <span className="site-tree-search-value">{searchValue}</span>
                        {afterStr}
                    </span>
                    ) : (
                    <span>{strTitle}</span>
                    );

                if (item.children) {
                    return {
                        title,
                        key: item.key,
                        children: loop(item.children)
                    };
                }
                return {
                    title,
                    key: item.key
                };
            });
    
        return loop(data);
      }, [searchValue]);

    const onSelect = (selectedKeys: Key[]) => {
    }
      
    return(
        <Fragment>
            <CardTitle>
                Nhóm
            </CardTitle>
            <Search
                style={{
                    marginBottom: 10
                }}
                placeholder="Search"
                onChange={onChange}
            />
            <Tree 
                onExpand={onExpand}
                onSelect={onSelect}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                treeData={treeData} 
                rootStyle={{background: "transparent", color: "#fff"}}
            />
        </Fragment>
    )
}

export default AuthorizeTree;