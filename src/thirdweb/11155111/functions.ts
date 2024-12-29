import {
  prepareEvent,
  prepareContractCall,
  readContract,
  type BaseTransactionOptions,
  type AbiParameterToPrimitiveType,
} from "thirdweb";

/**
 * Contract events
 */

/**
 * Represents the filters for the "Approval" event.
 */
export type ApprovalEventFilters = Partial<{
  owner: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "owner";
    type: "address";
  }>;
  approved: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "approved";
    type: "address";
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
}>;

/**
 * Creates an event object for the Approval event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { approvalEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  approvalEvent({
 *  owner: ...,
 *  approved: ...,
 *  tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function approvalEvent(filters: ApprovalEventFilters = {}) {
  return prepareEvent({
    signature:
      "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
    filters,
  });
}

/**
 * Represents the filters for the "ApprovalForAll" event.
 */
export type ApprovalForAllEventFilters = Partial<{
  owner: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "owner";
    type: "address";
  }>;
  operator: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "operator";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the ApprovalForAll event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { approvalForAllEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  approvalForAllEvent({
 *  owner: ...,
 *  operator: ...,
 * })
 * ],
 * });
 * ```
 */
export function approvalForAllEvent(filters: ApprovalForAllEventFilters = {}) {
  return prepareEvent({
    signature:
      "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
    filters,
  });
}

/**
 * Represents the filters for the "RoleAdminChanged" event.
 */
export type RoleAdminChangedEventFilters = Partial<{
  role: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "bytes32";
    name: "role";
    type: "bytes32";
  }>;
  previousAdminRole: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "bytes32";
    name: "previousAdminRole";
    type: "bytes32";
  }>;
  newAdminRole: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "bytes32";
    name: "newAdminRole";
    type: "bytes32";
  }>;
}>;

/**
 * Creates an event object for the RoleAdminChanged event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { roleAdminChangedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  roleAdminChangedEvent({
 *  role: ...,
 *  previousAdminRole: ...,
 *  newAdminRole: ...,
 * })
 * ],
 * });
 * ```
 */
export function roleAdminChangedEvent(
  filters: RoleAdminChangedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)",
    filters,
  });
}

/**
 * Represents the filters for the "RoleGranted" event.
 */
export type RoleGrantedEventFilters = Partial<{
  role: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "bytes32";
    name: "role";
    type: "bytes32";
  }>;
  account: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "account";
    type: "address";
  }>;
  sender: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "sender";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the RoleGranted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { roleGrantedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  roleGrantedEvent({
 *  role: ...,
 *  account: ...,
 *  sender: ...,
 * })
 * ],
 * });
 * ```
 */
export function roleGrantedEvent(filters: RoleGrantedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
    filters,
  });
}

/**
 * Represents the filters for the "RoleRevoked" event.
 */
export type RoleRevokedEventFilters = Partial<{
  role: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "bytes32";
    name: "role";
    type: "bytes32";
  }>;
  account: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "account";
    type: "address";
  }>;
  sender: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "sender";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the RoleRevoked event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { roleRevokedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  roleRevokedEvent({
 *  role: ...,
 *  account: ...,
 *  sender: ...,
 * })
 * ],
 * });
 * ```
 */
export function roleRevokedEvent(filters: RoleRevokedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)",
    filters,
  });
}

/**
 * Represents the filters for the "Transfer" event.
 */
export type TransferEventFilters = Partial<{
  from: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "from";
    type: "address";
  }>;
  to: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "to";
    type: "address";
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
}>;

/**
 * Creates an event object for the Transfer event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { transferEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  transferEvent({
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function transferEvent(filters: TransferEventFilters = {}) {
  return prepareEvent({
    signature:
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    filters,
  });
}

/**
 * Contract read functions
 */

/**
 * Calls the "DEFAULT_ADMIN_ROLE" function on the contract.
 * @param options - The options for the DEFAULT_ADMIN_ROLE function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { DEFAULT_ADMIN_ROLE } from "TODO";
 *
 * const result = await DEFAULT_ADMIN_ROLE();
 *
 * ```
 */
export async function DEFAULT_ADMIN_ROLE(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xa217fddf",
      [],
      [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
    ],
    params: [],
  });
}

/**
 * Calls the "VERIFIED_USER_ROLE" function on the contract.
 * @param options - The options for the VERIFIED_USER_ROLE function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { VERIFIED_USER_ROLE } from "TODO";
 *
 * const result = await VERIFIED_USER_ROLE();
 *
 * ```
 */
export async function VERIFIED_USER_ROLE(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x1893eae8",
      [],
      [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
    ],
    params: [],
  });
}

/**
 * Represents the parameters for the "balanceOf" function.
 */
export type BalanceOfParams = {
  owner: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "owner";
    type: "address";
  }>;
};

/**
 * Calls the "balanceOf" function on the contract.
 * @param options - The options for the balanceOf function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { balanceOf } from "TODO";
 *
 * const result = await balanceOf({
 *  owner: ...,
 * });
 *
 * ```
 */
export async function balanceOf(
  options: BaseTransactionOptions<BalanceOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x70a08231",
      [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [options.owner],
  });
}

/**
 * Represents the parameters for the "checkAccessPermission" function.
 */
export type CheckAccessPermissionParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
  user: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "user";
    type: "address";
  }>;
};

/**
 * Calls the "checkAccessPermission" function on the contract.
 * @param options - The options for the checkAccessPermission function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { checkAccessPermission } from "TODO";
 *
 * const result = await checkAccessPermission({
 *  tokenId: ...,
 *  user: ...,
 * });
 *
 * ```
 */
export async function checkAccessPermission(
  options: BaseTransactionOptions<CheckAccessPermissionParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xc66ddb5f",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
    ],
    params: [options.tokenId, options.user],
  });
}

/**
 * Represents the parameters for the "checkMinter" function.
 */
export type CheckMinterParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
};

/**
 * Calls the "checkMinter" function on the contract.
 * @param options - The options for the checkMinter function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { checkMinter } from "TODO";
 *
 * const result = await checkMinter({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function checkMinter(
  options: BaseTransactionOptions<CheckMinterParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xe3f35a7d",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
    ],
    params: [options.tokenId],
  });
}

/**
 * Represents the parameters for the "checkStoredIPFSHash" function.
 */
export type CheckStoredIPFSHashParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
};

/**
 * Calls the "checkStoredIPFSHash" function on the contract.
 * @param options - The options for the checkStoredIPFSHash function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { checkStoredIPFSHash } from "TODO";
 *
 * const result = await checkStoredIPFSHash({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function checkStoredIPFSHash(
  options: BaseTransactionOptions<CheckStoredIPFSHashParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x8de9fbc9",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
    ],
    params: [options.tokenId],
  });
}

/**
 * Represents the parameters for the "getApproved" function.
 */
export type GetApprovedParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
};

/**
 * Calls the "getApproved" function on the contract.
 * @param options - The options for the getApproved function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getApproved } from "TODO";
 *
 * const result = await getApproved({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getApproved(
  options: BaseTransactionOptions<GetApprovedParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x081812fc",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
    ],
    params: [options.tokenId],
  });
}

/**
 * Represents the parameters for the "getIPFSHash" function.
 */
export type GetIPFSHashParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
  caller: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "caller";
    type: "address";
  }>;
};

/**
 * Calls the "getIPFSHash" function on the contract.
 * @param options - The options for the getIPFSHash function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getIPFSHash } from "TODO";
 *
 * const result = await getIPFSHash({
 *  tokenId: ...,
 *  caller: ...,
 * });
 *
 * ```
 */
export async function getIPFSHash(
  options: BaseTransactionOptions<GetIPFSHashParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xf18b87fb",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "caller",
          type: "address",
        },
      ],
      [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
    ],
    params: [options.tokenId, options.caller],
  });
}

/**
 * Represents the parameters for the "getIPFSHashNoAccessControl" function.
 */
export type GetIPFSHashNoAccessControlParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
};

/**
 * Calls the "getIPFSHashNoAccessControl" function on the contract.
 * @param options - The options for the getIPFSHashNoAccessControl function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getIPFSHashNoAccessControl } from "TODO";
 *
 * const result = await getIPFSHashNoAccessControl({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getIPFSHashNoAccessControl(
  options: BaseTransactionOptions<GetIPFSHashNoAccessControlParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x5827ac74",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
    ],
    params: [options.tokenId],
  });
}

/**
 * Represents the parameters for the "getRoleAdmin" function.
 */
export type GetRoleAdminParams = {
  role: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "role";
    type: "bytes32";
  }>;
};

/**
 * Calls the "getRoleAdmin" function on the contract.
 * @param options - The options for the getRoleAdmin function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getRoleAdmin } from "TODO";
 *
 * const result = await getRoleAdmin({
 *  role: ...,
 * });
 *
 * ```
 */
export async function getRoleAdmin(
  options: BaseTransactionOptions<GetRoleAdminParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x248a9ca3",
      [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
      ],
      [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
    ],
    params: [options.role],
  });
}

/**
 * Represents the parameters for the "hasRole" function.
 */
export type HasRoleParams = {
  role: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "role";
    type: "bytes32";
  }>;
  account: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "account";
    type: "address";
  }>;
};

/**
 * Calls the "hasRole" function on the contract.
 * @param options - The options for the hasRole function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { hasRole } from "TODO";
 *
 * const result = await hasRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * ```
 */
export async function hasRole(options: BaseTransactionOptions<HasRoleParams>) {
  return readContract({
    contract: options.contract,
    method: [
      "0x91d14854",
      [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
    ],
    params: [options.role, options.account],
  });
}

/**
 * Represents the parameters for the "isApprovedForAll" function.
 */
export type IsApprovedForAllParams = {
  owner: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "owner";
    type: "address";
  }>;
  operator: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "operator";
    type: "address";
  }>;
};

/**
 * Calls the "isApprovedForAll" function on the contract.
 * @param options - The options for the isApprovedForAll function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isApprovedForAll } from "TODO";
 *
 * const result = await isApprovedForAll({
 *  owner: ...,
 *  operator: ...,
 * });
 *
 * ```
 */
export async function isApprovedForAll(
  options: BaseTransactionOptions<IsApprovedForAllParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xe985e9c5",
      [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
    ],
    params: [options.owner, options.operator],
  });
}

/**
 * Calls the "name" function on the contract.
 * @param options - The options for the name function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { name } from "TODO";
 *
 * const result = await name();
 *
 * ```
 */
export async function name(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x06fdde03",
      [],
      [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
    ],
    params: [],
  });
}

/**
 * Calls the "nextTokenIdToMint" function on the contract.
 * @param options - The options for the nextTokenIdToMint function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { nextTokenIdToMint } from "TODO";
 *
 * const result = await nextTokenIdToMint();
 *
 * ```
 */
export async function nextTokenIdToMint(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x3b1475a7",
      [],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [],
  });
}

/**
 * Represents the parameters for the "ownerOf" function.
 */
export type OwnerOfParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
};

/**
 * Calls the "ownerOf" function on the contract.
 * @param options - The options for the ownerOf function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { ownerOf } from "TODO";
 *
 * const result = await ownerOf({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function ownerOf(options: BaseTransactionOptions<OwnerOfParams>) {
  return readContract({
    contract: options.contract,
    method: [
      "0x6352211e",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
    ],
    params: [options.tokenId],
  });
}

/**
 * Represents the parameters for the "supportsInterface" function.
 */
export type SupportsInterfaceParams = {
  interfaceId: AbiParameterToPrimitiveType<{
    internalType: "bytes4";
    name: "interfaceId";
    type: "bytes4";
  }>;
};

/**
 * Calls the "supportsInterface" function on the contract.
 * @param options - The options for the supportsInterface function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { supportsInterface } from "TODO";
 *
 * const result = await supportsInterface({
 *  interfaceId: ...,
 * });
 *
 * ```
 */
export async function supportsInterface(
  options: BaseTransactionOptions<SupportsInterfaceParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x01ffc9a7",
      [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
    ],
    params: [options.interfaceId],
  });
}

/**
 * Calls the "symbol" function on the contract.
 * @param options - The options for the symbol function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { symbol } from "TODO";
 *
 * const result = await symbol();
 *
 * ```
 */
export async function symbol(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x95d89b41",
      [],
      [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
    ],
    params: [],
  });
}

/**
 * Represents the parameters for the "tokenURI" function.
 */
export type TokenURIParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
};

/**
 * Calls the "tokenURI" function on the contract.
 * @param options - The options for the tokenURI function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { tokenURI } from "TODO";
 *
 * const result = await tokenURI({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function tokenURI(
  options: BaseTransactionOptions<TokenURIParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xc87b56dd",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
    ],
    params: [options.tokenId],
  });
}

/**
 * Contract write functions
 */

/**
 * Represents the parameters for the "approve" function.
 */
export type ApproveParams = {
  to: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "to";
    type: "address";
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
};

/**
 * Calls the "approve" function on the contract.
 * @param options - The options for the "approve" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { approve } from "TODO";
 *
 * const transaction = approve({
 *  to: ...,
 *  tokenId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function approve(options: BaseTransactionOptions<ApproveParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x095ea7b3",
      [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.to, options.tokenId],
  });
}

/**
 * Represents the parameters for the "grantAccess" function.
 */
export type GrantAccessParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
  user: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "user";
    type: "address";
  }>;
};

/**
 * Calls the "grantAccess" function on the contract.
 * @param options - The options for the "grantAccess" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { grantAccess } from "TODO";
 *
 * const transaction = grantAccess({
 *  tokenId: ...,
 *  user: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function grantAccess(
  options: BaseTransactionOptions<GrantAccessParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x65dd152c",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.tokenId, options.user],
  });
}

/**
 * Represents the parameters for the "grantRole" function.
 */
export type GrantRoleParams = {
  role: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "role";
    type: "bytes32";
  }>;
  account: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "account";
    type: "address";
  }>;
};

/**
 * Calls the "grantRole" function on the contract.
 * @param options - The options for the "grantRole" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { grantRole } from "TODO";
 *
 * const transaction = grantRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function grantRole(options: BaseTransactionOptions<GrantRoleParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x2f2ff15d",
      [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.role, options.account],
  });
}

/**
 * Represents the parameters for the "mintNFT" function.
 */
export type MintNFTParams = {
  to: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "to";
    type: "address";
  }>;
  ipfsHash: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "ipfsHash";
    type: "string";
  }>;
};

/**
 * Calls the "mintNFT" function on the contract.
 * @param options - The options for the "mintNFT" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { mintNFT } from "TODO";
 *
 * const transaction = mintNFT({
 *  to: ...,
 *  ipfsHash: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function mintNFT(options: BaseTransactionOptions<MintNFTParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xeacabe14",
      [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "string",
          name: "ipfsHash",
          type: "string",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [options.to, options.ipfsHash],
  });
}

/**
 * Represents the parameters for the "renounceRole" function.
 */
export type RenounceRoleParams = {
  role: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "role";
    type: "bytes32";
  }>;
  account: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "account";
    type: "address";
  }>;
};

/**
 * Calls the "renounceRole" function on the contract.
 * @param options - The options for the "renounceRole" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { renounceRole } from "TODO";
 *
 * const transaction = renounceRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function renounceRole(
  options: BaseTransactionOptions<RenounceRoleParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x36568abe",
      [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.role, options.account],
  });
}

/**
 * Represents the parameters for the "revokeAccess" function.
 */
export type RevokeAccessParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
  user: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "user";
    type: "address";
  }>;
};

/**
 * Calls the "revokeAccess" function on the contract.
 * @param options - The options for the "revokeAccess" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { revokeAccess } from "TODO";
 *
 * const transaction = revokeAccess({
 *  tokenId: ...,
 *  user: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function revokeAccess(
  options: BaseTransactionOptions<RevokeAccessParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xd9a5ec1b",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.tokenId, options.user],
  });
}

/**
 * Represents the parameters for the "revokeRole" function.
 */
export type RevokeRoleParams = {
  role: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "role";
    type: "bytes32";
  }>;
  account: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "account";
    type: "address";
  }>;
};

/**
 * Calls the "revokeRole" function on the contract.
 * @param options - The options for the "revokeRole" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { revokeRole } from "TODO";
 *
 * const transaction = revokeRole({
 *  role: ...,
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function revokeRole(options: BaseTransactionOptions<RevokeRoleParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xd547741f",
      [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.role, options.account],
  });
}

/**
 * Represents the parameters for the "safeTransferFrom" function.
 */
export type SafeTransferFromParams = {
  from: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "from";
    type: "address";
  }>;
  to: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "to";
    type: "address";
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
};

/**
 * Calls the "safeTransferFrom" function on the contract.
 * @param options - The options for the "safeTransferFrom" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { safeTransferFrom } from "TODO";
 *
 * const transaction = safeTransferFrom({
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function safeTransferFrom(
  options: BaseTransactionOptions<SafeTransferFromParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x42842e0e",
      [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.from, options.to, options.tokenId],
  });
}

/**
 * Represents the parameters for the "setApprovalForAll" function.
 */
export type SetApprovalForAllParams = {
  operator: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "operator";
    type: "address";
  }>;
  approved: AbiParameterToPrimitiveType<{
    internalType: "bool";
    name: "approved";
    type: "bool";
  }>;
};

/**
 * Calls the "setApprovalForAll" function on the contract.
 * @param options - The options for the "setApprovalForAll" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { setApprovalForAll } from "TODO";
 *
 * const transaction = setApprovalForAll({
 *  operator: ...,
 *  approved: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setApprovalForAll(
  options: BaseTransactionOptions<SetApprovalForAllParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xa22cb465",
      [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      [],
    ],
    params: [options.operator, options.approved],
  });
}

/**
 * Represents the parameters for the "transferFrom" function.
 */
export type TransferFromParams = {
  from: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "from";
    type: "address";
  }>;
  to: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "to";
    type: "address";
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
};

/**
 * Calls the "transferFrom" function on the contract.
 * @param options - The options for the "transferFrom" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { transferFrom } from "TODO";
 *
 * const transaction = transferFrom({
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function transferFrom(
  options: BaseTransactionOptions<TransferFromParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x23b872dd",
      [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.from, options.to, options.tokenId],
  });
}
