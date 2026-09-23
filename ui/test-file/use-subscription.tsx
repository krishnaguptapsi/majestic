import React, { useState, useEffect } from "react";
import { DocumentNode } from "graphql";
import { useApolloClient } from "@apollo/client";

export default function useSubscription(
  query: DocumentNode,
  subscriptionQuery: DocumentNode,
  variables: any,
  queryResultMapper: (result: any) => any,
  subResultMapper: (result: any) => any,
  name: string = ""
) {
  const client = useApolloClient();
  const [result, setResult] = useState<any>({
    data: {},
    loading: false,
    error: null,
  });

  const pathKey = variables.path || null;

  useEffect(() => {
    if (client) {
      setResult((prev: any) => ({ ...prev, loading: true }));
      client
        .query({ query, variables, fetchPolicy: "network-only" })
        .then(({ data, errors, loading }) => {
          setResult({
            data: queryResultMapper(data),
            error: errors,
            loading,
          });
        });
    }
  }, [pathKey]);

  useEffect(() => {
    if (!client) return;

    const subscription = client
      .subscribe({ query: subscriptionQuery, variables, fetchPolicy: "network-only" })
      .subscribe({
        error: (error: any) => {
          setResult((prev: any) => ({ loading: false, data: prev.data, error }));
        },
        next: (nextResult: any) => {
          setResult({
            data: subResultMapper(nextResult.data),
            error: undefined,
            loading: false,
          });
        },
      });

    return () => subscription.unsubscribe();
  }, [pathKey]);

  return result;
}
