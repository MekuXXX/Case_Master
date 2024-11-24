import StatusDropdown from "@/components/custom/StatusDropdown";
import MaxWidthWrapper from "@/components/global/MaxWidthWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import React from "react";

type Props = {};

export default async function DashboardPage({}: Props) {
  // const session = await auth();

  // Note: For view now I will ADMIN_EMAIL to null to make this page visible for viewer
  // if (!user || user?.email !== process.env.ADMIN_EMAIL) {
  // return notFound();
  // }

  const orders = await db.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },

    include: {
      user: true,
      shippingAddress: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const lastWeekSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },

    _sum: {
      amount: true,
    },
  });

  const lastMonthSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },

    _sum: {
      amount: true,
    },
  });

  const WEEKLY_GOAL = Number(process.env.WEEKLY_GOAL) || 500;
  const MONTHLY_GOAL = Number(process.env.MONTHLY_GOAL) || 3000;

  return (
    <MaxWidthWrapper>
      <div className="flex min-h-screen w-full bg-muted/40">
        <div className="max-w-7xn mx-auto flex w-full flex-col sm:gap-4 sm:py-4">
          <div className="flex flex-col gap-16">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Last Week</CardDescription>
                  <CardTitle className="text-4xl">
                    {formatPrice(lastWeekSum._sum.amount ?? 0)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    of {formatPrice(WEEKLY_GOAL)}
                  </p>
                </CardContent>
                <CardFooter>
                  <Progress
                    value={((lastWeekSum._sum.amount ?? 0) * 100) / WEEKLY_GOAL}
                  />
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Last Month</CardDescription>
                  <CardTitle className="text-4xl">
                    {formatPrice(lastMonthSum._sum.amount ?? 0)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    of {formatPrice(MONTHLY_GOAL)}
                  </p>
                </CardContent>
                <CardFooter>
                  <Progress
                    value={
                      ((lastMonthSum._sum.amount ?? 0) * 100) / MONTHLY_GOAL
                    }
                  />
                </CardFooter>
              </Card>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Incoming orders
              </h1>
              <p className="text-sm text-gray-500">
                Note: This route must be hidden and protected, but I have
                disabled validation for demonstration purposes.
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Purchase date
                  </TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="bg-accent">
                    <TableCell>
                      <p className="font-medium">
                        {order.shippingAddress?.name}
                      </p>
                      <p className="hidded text-sm text-muted-foreground md:inline">
                        {order.user.email}
                      </p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <StatusDropdown
                        id={order.id}
                        orderStatus={order.status}
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {order.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(order.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
