import { addPropertyControls, ControlType } from "framer";

type Props = {
  name: string;
  image: string;
};

export default function ProductCard({ name, image }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: 20,
      }}
    >
      <span>{name}</span>

      <img
        src={image}
        style={{
          width: 100,
          height: 100,
          objectFit: "cover",
        }}
      />
    </div>
  );
}

addPropertyControls(ProductCard, {
  name: {
    type: ControlType.String,
    title: "Name",
  },
  image: {
    type: ControlType.Image,
    title: "Image",
  },
});
