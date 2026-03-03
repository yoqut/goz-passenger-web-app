import { NotificationCard } from "@/entities/notification/ui";
import { Container } from "@/shared/ui/container/container";
import { ChevronLeft } from "@untitledui/icons";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const mockOrderData = [
  {
    message:
      "Order placed successfully. Awaiting payment confirmation. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem, esse vel aspernatur unde fuga molestiae sapiente sed facilis aperiam earum necessitatibus enim labore nihil nobis libero corporis consequatur! Officia magni quae obcaecati inventore laudantium eius similique, voluptates maiores, ut nemo ratione? Molestias consequuntur, tempore dolorem reiciendis beatae dignissimos omnis eius facilis, ad, libero at! Harum nulla laborum est veniam voluptatem voluptate sit ratione debitis laudantium? Molestiae, architecto quas enim aliquid consequuntur rerum voluptate non quae quaerat sit corporis, quis ab sequi ipsum. Et magni autem laboriosam ut deserunt perferendis commodi fuga voluptatibus labore quas illum consequatur fugit nobis, a maxime!",
    date: "2025-11-30 22:05",
    orderNumber: "ORD-9284-A1",
    unread: true,
  },

  {
    message:
      "Payment confirmed. Preparing shipment now. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem, esse vel aspernatur unde fuga molestiae sapiente sed facilis aperiam earum necessitatibus enim labore nihil nobis libero corporis consequatur! Officia magni quae obcaecati inventore laudantium eius similique, voluptates maiores, ut nemo ratione? Molestias consequuntur, tempore dolorem reiciendis beatae dignissimos omnis eius facilis, ad, libero at! Harum nulla laborum est veniam voluptatem voluptate sit ratione debitis laudantium? Molestiae, architecto quas enim aliquid consequuntur rerum voluptate non quae quaerat sit corporis, quis ab sequi ipsum. Et magni autem laboriosam ut deserunt perferendis commodi fuga voluptatibus labore quas illum consequatur fugit nobis, a maxime!",
    date: "2025-12-01 09:15",
    orderNumber: "ORD-9284-A1",
    unread: false,
  },
  {
    message:
      "New product line added to inventory and catalog. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem, esse vel aspernatur unde fuga molestiae sapiente sed facilis aperiam earum necessitatibus enim labore nihil nobis libero corporis consequatur! Officia magni quae obcaecati inventore laudantium eius similique, voluptates maiores, ut nemo ratione? Molestias consequuntur, tempore dolorem reiciendis beatae dignissimos omnis eius facilis, ad, libero at! Harum nulla laborum est veniam voluptatem voluptate sit ratione debitis laudantium? Molestiae, architecto quas enim aliquid consequuntur rerum voluptate non quae quaerat sit corporis, quis ab sequi ipsum. Et magni autem laboriosam ut deserunt perferendis commodi fuga voluptatibus labore quas illum consequatur fugit nobis, a maxime!",
    date: "2025-12-01 11:30",
    orderNumber: "SYS-0001-B2",
    unread: true,
  },
  {
    message:
      "Order has been shipped via Express Mail. Tracking details sent to customer. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem, esse vel aspernatur unde fuga molestiae sapiente sed facilis aperiam earum necessitatibus enim labore nihil nobis libero corporis consequatur! Officia magni quae obcaecati inventore laudantium eius similique, voluptates maiores, ut nemo ratione? Molestias consequuntur, tempore dolorem reiciendis beatae dignissimos omnis eius facilis, ad, libero at! Harum nulla laborum est veniam voluptatem voluptate sit ratione debitis laudantium? Molestiae, architecto quas enim aliquid consequuntur rerum voluptate non quae quaerat sit corporis, quis ab sequi ipsum. Et magni autem laboriosam ut deserunt perferendis commodi fuga voluptatibus labore quas illum consequatur fugit nobis, a maxime!",
    date: "2025-12-02 17:45",
    orderNumber: "ORD-9284-A1",
    unread: false,
  },
  {
    message:
      "Payment confirmed. Preparing shipment now. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem, esse vel aspernatur unde fuga molestiae sapiente sed facilis aperiam earum necessitatibus enim labore nihil nobis libero corporis consequatur! Officia magni quae obcaecati inventore laudantium eius similique, voluptates maiores, ut nemo ratione? Molestias consequuntur, tempore dolorem reiciendis beatae dignissimos omnis eius facilis, ad, libero at! Harum nulla laborum est veniam voluptatem voluptate sit ratione debitis laudantium? Molestiae, architecto quas enim aliquid consequuntur rerum voluptate non quae quaerat sit corporis, quis ab sequi ipsum. Et magni autem laboriosam ut deserunt perferendis commodi fuga voluptatibus labore quas illum consequatur fugit nobis, a maxime!",
    date: "2025-12-01 09:15",
    orderNumber: "ORD-9284-A1",
    unread: true,
  },
  {
    message:
      "New product line added to inventory and catalog. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem, esse vel aspernatur unde fuga molestiae sapiente sed facilis aperiam earum necessitatibus enim labore nihil nobis libero corporis consequatur! Officia magni quae obcaecati inventore laudantium eius similique, voluptates maiores, ut nemo ratione? Molestias consequuntur, tempore dolorem reiciendis beatae dignissimos omnis eius facilis, ad, libero at! Harum nulla laborum est veniam voluptatem voluptate sit ratione debitis laudantium? Molestiae, architecto quas enim aliquid consequuntur rerum voluptate non quae quaerat sit corporis, quis ab sequi ipsum. Et magni autem laboriosam ut deserunt perferendis commodi fuga voluptatibus labore quas illum consequatur fugit nobis, a maxime!",
    date: "2025-12-01 11:30",
    orderNumber: "SYS-0001-B2",
    unread: true,
  },
  {
    message:
      "Order has been shipped via Express Mail. Tracking details sent to customer. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem, esse vel aspernatur unde fuga molestiae sapiente sed facilis aperiam earum necessitatibus enim labore nihil nobis libero corporis consequatur! Officia magni quae obcaecati inventore laudantium eius similique, voluptates maiores, ut nemo ratione? Molestias consequuntur, tempore dolorem reiciendis beatae dignissimos omnis eius facilis, ad, libero at! Harum nulla laborum est veniam voluptatem voluptate sit ratione debitis laudantium? Molestiae, architecto quas enim aliquid consequuntur rerum voluptate non quae quaerat sit corporis, quis ab sequi ipsum. Et magni autem laboriosam ut deserunt perferendis commodi fuga voluptatibus labore quas illum consequatur fugit nobis, a maxime!",
    date: "2025-12-02 17:45",
    orderNumber: "ORD-9284-A1",
    unread: false,
  },
];

export const NotiicatioPpage = () => {
  const { t } = useTranslation();
  return (
    <Container className="flex flex-col p-4 h-screen bg-primary">
      <header className="relative flex items-center mt-5">
        <div className="absolute left-0 flex items-center ">
          <Link to="/" className=" pr-5 py-3">
            <ChevronLeft />
          </Link>
        </div>
        <h1 className="text-lg text-black text-center font-semibold flex-1">
          {t("notification.title")}
        </h1>
      </header>
      <main className="space-y-3 flex-1 overflow-y-auto mt-4 pb-20">
        <div className="flex flex-col gap-3">
          {mockOrderData.map((item, index) => (
            <NotificationCard key={index} {...item} />
          ))}
        </div>
      </main>
    </Container>
  );
};
