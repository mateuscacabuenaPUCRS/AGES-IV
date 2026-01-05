import { cva, type VariantProps } from "class-variance-authority";
import { getUserAvatar } from "@/constant/defaultAvatar";

const avatarVariants = cva("object-cover", {
  variants: {
    size: {
      small: "h-6 w-6 rounded-xl",
      medium: "h-10 w-10 rounded-[20px]",
      large: "h-[100px] w-[100px] rounded-[15px]",
    },
  },
});

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  imgUrl?: string | null;
  alt?: string;
}

export function Avatar({ imgUrl, size = "medium", alt = "Avatar do usuário" }: AvatarProps) {
  return <img src={getUserAvatar(imgUrl)} alt={alt} className={avatarVariants({ size })} />;
}
