import React from "react";

export const ReadMore = ({ children }) => {
  const text = children ?? "";
  const [isReadMore, setIsReadMore] = React.useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <p className="pt-2 text-xs pr-6">
      {isReadMore ? text?.slice(0, 150) : text}
      {text?.length > 150 && (
        <span
          onClick={toggleReadMore}
          className="bold"
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            fontWeight: 600,
          }}
        >
          {isReadMore ? "...read more" : " show less"}
        </span>
      )}
    </p>
  );
};
