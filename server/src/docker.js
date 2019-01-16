import Docker from 'dockerode'
import { addContainer, listContainers, removeContainer } from './database'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

/* Custom data class for storing information about a container. */

class ContainerInfo {
  constructor(id, subdomain, ip, image) {
    this.id = id
    this.subdomain = subdomain
    this.ip = ip
    this.image = image
  }
}

function containerInfoTransform(containerInfo) {
  console.log(containerInfo.NetworkSettings.IPAddress)
  return new ContainerInfo(
    containerInfo.Id,
    containerInfo.Id,
    containerInfo.NetworkSettings.IPAddress,
    containerInfo.Image
  )
}

async function getContainerInfo(id) {
  const containerInfo = await docker.getContainer(id).inspect()
  return containerInfoTransform(containerInfo)
}

export async function getRunningContainers() {
  return listContainers()
}

export async function createNewContainer(image) {
  const container = await docker.createContainer({
    Image: image,
  })

  await container.start()
  const containerInfo = await getContainerInfo(container.id)

  const containerData = {
    id: containerInfo.id,
    subdomain: containerInfo.subdomain,
    ip: containerInfo.ip,
    userId: 'da776df3',
    blob: null,
  }

  await addContainer(containerData)

  return containerData
}

export async function stopContainer(id) {
  const container = await docker.getContainer(id)
  await container.stop()
}

export async function deleteContainer(id) {
  const container = await docker.getContainer(id)
  await container.remove()
  await removeContainer(id)
}
