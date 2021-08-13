import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const dropAreaStyle = `p-2`;
const dragElmntStyle = `border-[2px] border-gray-800 p-1 pl-3 my-8 mx-3 bg-gray-300`;
const codeInfo = [
  {
    id: "h1",
    contextHeader: "<h1>",
    innerChild: [
      {
        id: "div9",
        contextHeader: "<div9>",
        innerChild: [],
        contextEnd: "</div>",
      },
    ],
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
    contextHeader: "<div3>",
    innerChild: [
      {
        id: "div6",
        contextHeader: "<div6>",
        innerChild: [],
        contextEnd: "</div>",
      },
      {
        id: "div7",
        contextHeader: "<div7>",
        innerChild: [
          {
            id: "div8",
            contextHeader: "<div8>",
            innerChild: [],
            contextEnd: "</div>",
          },
        ],
        contextEnd: "</div>",
      },
    ],
    contextEnd: "</div>",
  },
  {
    id: "p4",
    contextHeader: "<p4>",
    innerChild: [],
    contextEnd: "</p>",
  },
  {
    id: "span5",
    contextHeader: "<span5>",
    innerChild: [],
    contextEnd: "</span>",
  },
];

function DragElmnt({ id, index, contextHeader, contextEnd, innerChild }) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        // console.log("drag element: ");
        // console.log(provided);
        // console.log(snapshot);
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`group w-full p-1 pl-3 my-3 border-[2px] border-blue-900 bg-gray-300 ${
              snapshot.isDragging ? "opacity-50" : ""
            }`}
          >
            <div
              className={`hover:bg-yellow-300`}
              {...provided.dragHandleProps}
            >
              {contextHeader}
            </div>
            <DropArea id={id} state={!snapshot.isDragging}>
              {innerChild.length === 0 ? (
                <span></span>
              ) : (
                innerChild.map((item, index) => (
                  <DragElmnt
                    key={`${item.id}${index}`}
                    id={`${item.id}`}
                    index={index}
                    contextHeader={item.contextHeader}
                    contextEnd={item.contextEnd}
                    innerChild={item.innerChild}
                  />
                ))
              )}
            </DropArea>
            <div className="">{contextEnd}</div>
          </div>
        );
      }}
    </Draggable>
  );
}

function DropArea({ children, id, state }) {
  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => {
        // console.log("drop area: ");
        // console.log(provided);
        // console.log(snapshot);
        return (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-2 ${
              snapshot.isDraggingOver ? `bg-green-300 bg-opacity-50` : ``
            } ${state ? "" : "hidden"}`}
          >
            {children}
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
}

function DndBox({ contents }) {
  return (
    <div className="w-5/6 h-[80vh] p-4 pt-10 rounded-xl bg-gradient-to-br from-white to-gray-600 shadow-xl overflow-y-scroll">
      <DropArea id={`BaseCodeArea`} state={true}>
        {contents
          ? contents.map((item, index) => (
              <DragElmnt
                key={`${item.id}${index}`}
                id={item.id}
                index={index}
                contextHeader={item.contextHeader}
                contextEnd={item.contextEnd}
                innerChild={item.innerChild}
              />
            ))
          : null}
      </DropArea>
    </div>
  );
}

function Container({ contents }) {
  return (
    <div className="w-sreen h-screen flex justify-center items-center bg-gradient-to-tl from-yellow-300 via-red-500 to-purple-600">
      <DndBox contents={contents} />
    </div>
  );
}

function App() {
  const [codes, setCode] = useState([...codeInfo]);
  const [codesNumber, setCodesNumber] = useState(codeInfo.length);

  function findArea(cursor, targetId, path, state) {
    if (cursor.id === targetId) {
      return (state ? `${path}${cursor.id}` : path)
    }
    if (cursor.innerChild.length === 0) {
      return "";
    }
    return cursor.innerChild
      .map((item) => {
        return findArea(item, targetId, path + `${cursor.id}-`, state);
      })
      .join("");
  }

  function getDeleteCode(codes, cursor, path, deleteTargetIndex) {
    path.forEach((item) => {
      if (item) {
        let i = cursor.indexOf(cursor.filter((it) => it.id === item)[0]);
        cursor = cursor[i].innerChild;
      }
    });
    let source = cursor[deleteTargetIndex];
    cursor.splice(deleteTargetIndex, 1);
    setCode([...codes]);
    return source;
  }

  function addCode(codes, cursor, path, targetIndex, target) {
    path.forEach((item) => {
      if (item) {
        let i = cursor.indexOf(cursor.filter((it) => it.id === item)[0]);
        cursor = cursor[i].innerChild;
      }
    });
    cursor.splice(targetIndex, 0, target);
    setCode([...codes]);
  }

  function onDragEnd(result) {
    const { draggableId, source, destination } = result;
    if (!destination) {
      return;
    }
    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    ) {
      return;
    }
    if (draggableId === source.droppableId) {
      return;
    }

    let from = [];
    let end = [];

    codes.forEach((item) => {
      let thing = findArea(item, draggableId, "");
      from.push(thing ? thing : "");
    });
    from = from.join("").split("-");

    const tmp = getDeleteCode(codes, codes, from, source.index);

    codes.forEach((item) => {
      let thing = findArea(item, destination.droppableId, "", "destination");
      end.push(thing ? thing : "");
    });

    end = end.join("").split("-");
    
    
    addCode(codes, codes, end, destination.index, tmp);
  }

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <Container contents={codes} />
    </DragDropContext>
  );
}

export default App;
