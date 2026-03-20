/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppRouter } from "./routes";
import { AuthProvider } from "./hooks/useAuth";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
