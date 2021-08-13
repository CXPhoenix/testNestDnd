import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const dropAreaStyle = `p-2`;
const dragElmntStyle = `border-[2px] border-gray-800 p-1 pl-3 my-8 mx-3 bg-gray-300`;
const codeInfo = [
  {
    id: "h1",
    contextHeader: "<h1>",
    innerChild: [],
    contextEnd: "</h1>",
  },
  {
    id: "h2",
    contextHeader: "<h2>",
    innerChild: [],
    contextEnd: "</h2>",
  },
  {
    id: "div3",
    contextHeader: "<div>",
    innerChild: [],
    contextEnd: "</div>",
  },
  {
    id: "p4",
    contextHeader: "<p>",
    innerChild: [],
    contextEnd: "</p>",
  },
  {
    id: "span5",
    contextHeader: "<span>",
    innerChild: [],
    contextEnd: "</span>",
  },
];

function DragElmnt({
  id,
  codeType,
  index,
  className,
  contextHeader,
  innerChild,
  contextEnd,
}) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`${className} ${snapshot.isDragging && `opacity-60`}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <span className={`block`} {...provided.dragHandleProps}>
            {contextHeader}
          </span>
          <DropArea
            id={`${id}`}
            className={`${dropAreaStyle} ${innerChild ? `p-1` : ``}`}
            condition={!snapshot.isDragging}
            children={innerChild}
            type={codeType}
          />
          <span className={`block`}>{contextEnd}</span>
        </div>
      )}
    </Draggable>
  );
}

function DropArea({ id, type, codeType, className, condition, children }) {
  return (
    <div>
      {condition ? (
        <Droppable droppableId={id} type={type}>
          {(provided, snapshot) => (
            <div
              className={`${className} ${
                snapshot.isDraggingOver && `bg-green-200 bg-opacity-60`
              }`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {!children
                ? ""
                : children.map((item, index) => (
                    <DragElmnt
                      key={`${item.id}${index}`}
                      id={`${id === "BaseCodeArea" ? "" : `${id}-`}${item.id}`}
                      index={index}
                      className={dragElmntStyle}
                      contextHeader={item.contextHeader}
                      innerChild={item.innerChild}
                      contextEnd={item.contextEnd}
                      codeType={codeType}
                    />
                  ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ) : (
        ""
      )}
    </div>
  );
}

function DndBox({ content }) {
  return (
    <div className="w-5/6 h-[80vh] p-1 rounded-xl bg-gradient-to-br from-white to-gray-600 shadow-xl overflow-scroll">
      <DropArea
        id={`BaseCodeArea`}
        type={`BaseCodeArea`}
        codeType={`BaseCodeArea`}
        className={`${dropAreaStyle} h-full`}
        condition={true}
        children={content}
      />
    </div>
  );
}

function Container({ content }) {
  return (
    <div className="w-sreen h-screen flex justify-center items-center bg-gradient-to-tl from-yellow-300 via-red-500 to-purple-600">
      <DndBox content={content} />
    </div>
  );
}

function App() {
  const [code, setCode] = useState([...codeInfo]);
  function onDragEnd(result) {
    const { source, destination, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    ) {
      return;
    }
    if (draggableId === destination.droppableId) {
      return;
    }

    function getSourceElmntAndDeleteFromArray(all, current, path, index) {
      if (path.length === 0) {
        const tmp = current[index];
        current.splice(index, 1);
        setCode(all);
        return tmp;
      }
      let nowSearch = path.shift();
      let getIndex = current.map((item, searchIndex) => {
        if (item.id === nowSearch) {
          return searchIndex;
        }
      });
      return getSourceElmntAndDeleteFromArray(
        all,
        current[parseInt(getIndex.join(""))].innerChild,
        path,
        index
      );
    }

    function getSourceElmntAndAddToArray(all, current, path, index, child) {
      console.log(path);
      if (path.length === 0 || path[0] === "BaseCodeArea") {
        current.splice(index, 0, child);
        console.log(current);
        setCode(all);
        console.log(code);
        return;
      }
      let nowSearch = path.shift();
      let getIndex = current.map((item, index) => {
        if (item.id === nowSearch) {
          return index;
        }
      });
      console.log(current[parseInt(getIndex.join(""))]);
      return getSourceElmntAndAddToArray(
        all,
        current[parseInt(getIndex.join(""))].innerChild,
        path,
        index,
        child
      );
    }

    let sourceElmntPath = draggableId.split("-");
    const sourceElmntId = sourceElmntPath.pop();
    // const sourcePath = getPath(code, sourceElmntPath);
    // const tmp = sourcePath[source.index]
    const tmp = getSourceElmntAndDeleteFromArray(
      code,
      code,
      sourceElmntPath,
      source.index
    );
    // sourcePath.splice(source.index, 1)

    let destinationAreaPath = destination.droppableId.split("-");
    const destinationPath = getSourceElmntAndAddToArray(
      code,
      code,
      destinationAreaPath,
      destination.index,
      tmp
    );
    // destinationPath.splice(destination.index, 0, tmp)

    console.log(code);

    console.log(result);
  }
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={(result) => {
        console.log(result);
      }}
    >
      <Container content={code} />
    </DragDropContext>
  );
}

export default App;
